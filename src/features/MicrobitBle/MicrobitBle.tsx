//@ts-ignore: : needs React
import React, { useState } from 'react'
import './microbitBle.scss'
import { connectDevice, disconnectDevice } from '../../app/ble'
import store from '../../app/store'
import { setAccelerometer, setBtnAState, setBtnBState, setMagnetometer, setPinValues, setTemperature } from '../SensorDataView/sensorDataSlice'
import { accService, btnService, deviceInfoService, ledService, magService, pinService, tmpService } from '../../app/microbitBleServices'
import ConnectionControls from '../../common/ConnectionControls/ConnectionControls'
import SensorDataView from '../SensorDataView/SensorDataView'
import DeviceInfo from '../DeviceInfo/DeviceInfo'
import { useDispatch } from 'react-redux'
import ControlsSection from '../../common/ControlsSection/ControlsSection'
import Spacer from '../../common/Spacer/Spacer'
import DeviceConfig from '../DeviceConfig/DeviceConfig'
import { PIN_FILTER } from '../../app/constants'
import { setModelNr, setFwRev, setDeviceName, setDeviceId } from '../DeviceInfo/deviceInfoSlice'
import InputControl from '../InputControl/InputControl'
import { AlertDialogContext } from '../../common/AlertDialog/AlertDialogContext'

const isCompatible = navigator.bluetooth !== undefined

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugNotifyCb = (e:Event)=>{
  const characteristic = e.target as BluetoothRemoteGATTCharacteristic
  const byteArr = []
  for (let index = 0; index < (characteristic.value?.byteLength || 0); index++) {
    byteArr.push(characteristic.value?.getUint8(index))
  }
  console.debug(`${characteristic.uuid}: ${byteArr}`)
}

const debugReadCb = (uuid:string, data:DataView)=>{
  const byteArr = []
  for (let index = 0; index < (data.byteLength || 0); index++) {
    byteArr.push(data.getUint8(index))
  }
  console.debug(`${uuid}: ${byteArr}`)
}

const accCb = (e:Event)=>{
  const characteristic = e.target as BluetoothRemoteGATTCharacteristic
  if (characteristic.value){
    const value = {
      x:characteristic.value.getInt16(0,true),
      y:characteristic.value.getInt16(2,true),
      z:characteristic.value.getInt16(4,true)
    }
    store.dispatch(setAccelerometer(value))
  }
}

const magCb = (e:Event)=>{
  const characteristic = e.target as BluetoothRemoteGATTCharacteristic
  if (characteristic.value){
    const value = {
      x:characteristic.value.getInt16(0,true),
      y:characteristic.value.getInt16(2,true),
      z:characteristic.value.getInt16(4,true)
    }
    store.dispatch(setMagnetometer(value))
  }
}

const tmpCb = (e:Event)=>{
  const characteristic = e.target as BluetoothRemoteGATTCharacteristic
  if (characteristic.value){
    const value = characteristic.value.getInt8(0)
    store.dispatch(setTemperature(value))
  }
}

const btnCb = (e:Event)=>{
  const characteristic = e.target as BluetoothRemoteGATTCharacteristic
  if (characteristic.value){
    const value = characteristic.value.getInt8(0)
    if (characteristic.uuid === btnService.characteristics.btnA.uuid){
      store.dispatch(setBtnAState(value))
    } else {
      store.dispatch(setBtnBState(value))
    }
  }
}

const pinCb = (e:Event)=>{
  const characteristic = e.target as BluetoothRemoteGATTCharacteristic
  if (characteristic.value){
    const value:{[key:number]:number} = {} 
    for (let index = 0; index < characteristic.value.byteLength; index+=2) {
      value[characteristic.value.getUint8(index)] = characteristic.value.getUint8(index+1)
    }
    store.dispatch(setPinValues(value))
  }
}

const modelNrCb = (_uuid:string, data:DataView)=>{
  const value = new TextDecoder().decode(data)
  store.dispatch(setModelNr(value))
}

const fwRevCb = (_uuid:string, data:DataView)=>{
  const value = new TextDecoder().decode(data)
  store.dispatch(setFwRev(value))
}

const subscriberFactory = ()=>{
  const subscribers = {
    deviceInfoService: {...deviceInfoService},
    btnService: {...btnService},
    ledService: {...ledService},
    accService: {...accService},
    magService: {...magService},
    tmpService: {...tmpService},
    pinService: {...pinService}
  }
  subscribers.deviceInfoService.characteristics.modelNr.readCb = modelNrCb
  subscribers.deviceInfoService.characteristics.fwRev.readCb = fwRevCb

  subscribers.btnService.characteristics.btnA.notifyCb = btnCb
  subscribers.btnService.characteristics.btnB.notifyCb = btnCb

  subscribers.ledService.characteristics.matrixState.readCb = debugReadCb

  subscribers.accService.characteristics.accData.notifyCb = accCb
  subscribers.magService.characteristics.magData.notifyCb = magCb
  subscribers.tmpService.characteristics.tmpData.notifyCb = tmpCb
  subscribers.pinService.characteristics.pinData.notifyCb = pinCb
  subscribers.pinService.characteristics.pinIOConfig.readCb = debugReadCb
  return subscribers
}

const MicrobitBle = ()=>{
  const spaceLength = 42
  const dispatch = useDispatch()
  const subscribers = subscriberFactory()
  const [connected,setConnected] = useState(false)
  const { handleAlertDialog } = React.useContext(AlertDialogContext)

  const connectCb = (id:string,name:string)=>{
    setConnected(true)
    dispatch(setDeviceName(name))
    dispatch(setDeviceId(id))
  }
  const disconnectCb = (e:Event)=>{
    console.debug(e)
    setConnected(false)
  }
  const handleConnectClick = ()=>connectDevice(
    Object.values(subscribers),
    disconnectCb,
    connectCb
  ).catch((e:Error)=>{
    handleAlertDialog(true,{
      severenity: 'error',
      message: e.message
    })
  })
  const handleDisconnectClick = ()=>{
    disconnectDevice()
  }

  if (!isCompatible){
    handleAlertDialog(true,{
      severenity: 'error',
      message: 'Your browser is unfortunatelly not supported. Try new version of MS Edge or Google Chrome.'
    })
  }
  
  return(
    <div className='microbit-ble'>
      <ConnectionControls 
        isConnected={connected} 
        onConnectClick={handleConnectClick}
        onDisconnectClick={handleDisconnectClick}
      />
      <Spacer length={spaceLength}/>
      <ControlsSection 
        header={'DEVICE INFO'}>
        <DeviceInfo/>
      </ControlsSection>
      <Spacer length={spaceLength}/>
      <ControlsSection 
        header={'SENSOR DATA VIEW'}>
        <SensorDataView/>
      </ControlsSection>
      <Spacer length={spaceLength}/>
      <ControlsSection 
        header={'INPUT'}>
        <InputControl connected={connected} pinFilter={PIN_FILTER}/>
      </ControlsSection>
      <Spacer length={spaceLength}/>
      <ControlsSection 
        header={'CONFIG'}>
        <DeviceConfig connected={connected} pinFilter={PIN_FILTER}/>
      </ControlsSection>
      <Spacer length={spaceLength}/>
    </div>
  )
}

export default MicrobitBle