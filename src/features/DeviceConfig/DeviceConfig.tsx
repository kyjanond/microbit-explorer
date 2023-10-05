/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import PinsConfig, { IPinState } from '../../common/PinsConfig/PinsConfig'
import { readCharacteristic, writeCharacteristic } from '../../app/ble'
import { pinService } from '../../app/microbitBleServices'
import { selectPinConfigFiltered, setPinConfigAll } from './deviceConfigSlice'
import store, { RootState } from '../../app/store'


const writePinConfig = async (pinIOMask:ArrayBuffer,pinADMask:ArrayBuffer)=>{
  return writeCharacteristic(
    pinService.uuid,
    pinService.characteristics.pinIOConfig.uuid,
    pinIOMask
  ).then(()=>
    writeCharacteristic(
      pinService.uuid,
      pinService.characteristics.pinADConfig.uuid,
      pinADMask
    )
  ).then(()=>{
    return readPinConfig()
  })
}

const readPinConfig = async ()=>{
  const pinMasks = await readCharacteristic(
    pinService.uuid,
    pinService.characteristics.pinIOConfig.uuid
  ).then(ioConfig=>{
    const ioConfigPromise = Promise.resolve(ioConfig)
    const adConfigPromise = readCharacteristic(
      pinService.uuid,
      pinService.characteristics.pinADConfig.uuid
    )
    return Promise.all([ioConfigPromise,adConfigPromise])
  })
  const pinConfig:{[key:number]:IPinState} = {}
  const ioConfigValue = pinMasks[0].getUint32(0,true)
  const adConfigValue = pinMasks[1].getUint32(0,true)
  for (let pinIndex = 0; pinIndex < 20; pinIndex++) {
    pinConfig[pinIndex] = {
      isInput: (ioConfigValue & (1<<pinIndex)) !== 0,
      isAnalog: (adConfigValue & (1<<pinIndex)) !== 0,
      isUndefined: false
    }
    
  }
  store.dispatch(setPinConfigAll(pinConfig))
  return pinConfig
}

export interface IDeviceConfig {
  className?:string,
  connected:boolean,
  pinFilter:number[]
}

const DeviceConfig = (props:IDeviceConfig)=>{
  const pinConfig = useSelector(selectPinConfigFiltered(props.pinFilter),shallowEqual )
  React.useEffect(()=>{
    if (props.connected){
      new Promise(r => setTimeout(r, 1000)).then(()=>{
        readPinConfig()
      })
    }
  },[props.connected])
  const handleSavePinStatesClick = (pinIOMask:Uint32Array, pinADMask:Uint32Array)=>{
    writePinConfig(pinIOMask.buffer,pinADMask.buffer)
  }
  const handleReloadPinStatesClick = ()=>{
    readPinConfig()
  }
  return(
    <div className={`${props.className?props.className:' device-config'}`}>
      <PinsConfig 
        isConnected={props.connected} 
        pinStates={pinConfig} 
        onSaveClick={handleSavePinStatesClick} 
        onReloadClick={handleReloadPinStatesClick}/>
    </div>
  )
}

export default DeviceConfig