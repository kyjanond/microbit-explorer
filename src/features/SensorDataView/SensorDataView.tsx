/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { useSelector } from 'react-redux'
import { ISimpleVector3, selectAccelerometerData, selectBtnState, selectMagnetometerData, selectPinValues, selectTemperatureData, setPinValues, setPinValuesAll } from './sensorDataSlice'
import { Typography } from '@mui/material'
import { selectPinConfigAll } from '../DeviceConfig/deviceConfigSlice'
import store from '../../app/store'
import { observeStore } from '../../app/utilities'
import { readCharacteristic } from '../../app/ble'
import { pinService } from '../../app/microbitBleServices'

const simpleVector3ToString = (vec:ISimpleVector3) => {
  const vecString = Object.values(vec).map((v)=>{ return typeof (v) === 'number' ? v.toString().padStart(6,'\xa0') : v })
  return `{${vecString}}`
}

const btnStateToString = (btnState:ReturnType<typeof selectBtnState> ) =>{
  return `A${btnState.A}, B${btnState.B}`
}

const pinValueToString = (pinState:ReturnType<typeof selectPinValues> ) =>{
  const values = Object.entries(pinState).map(([k,v])=>{
    return `[${k.toString().padStart(2,'0')}]: ${v.toString().padStart(3,'0')}, `
  }).reduce((p,c)=>p+=c,'')
  if (values.length>0){
    return values.substring(0,values.length-2)
  }
  return values
}

observeStore(
  store,
  (store)=>{return store.deviceConfig.pinsConfig},
  (state)=>{
    readCharacteristic(
      pinService.uuid,
      pinService.characteristics.pinData.uuid
    ).then((value)=>{
      const pinValues:{[key:number]:number} = {} 
      for (let index = 0; index < value.byteLength; index+=2) {
        pinValues[value.getUint8(index)] = value.getUint8(index+1)
      }
      store.dispatch(setPinValuesAll(pinValues))
    })
  }
)

export interface ISensorDataViewProps {
  className?:string,
} 

const SensorDataView = (props:ISensorDataViewProps)=>{
  const temperature = useSelector(selectTemperatureData)
  const accelerometer = useSelector(selectAccelerometerData)
  const magnetometer = useSelector(selectMagnetometerData)
  const btn = useSelector(selectBtnState)
  const pin = useSelector(selectPinValues)  
  return(
    <div className={`${props.className?props.className:''} sensor-data-view`}>
      <Typography variant='body2'>
        TMP: {temperature} °C;
      </Typography>
      <Typography variant='body2'>
        ACC: {simpleVector3ToString(accelerometer)}
      </Typography>
      <Typography variant='body2'>
        MAG: {simpleVector3ToString(magnetometer)}
      </Typography>
      <Typography variant='body2'>
        BTN: {btnStateToString(btn)}
      </Typography>
      <Typography variant='body2'>
        PIN: {pinValueToString(pin)}
      </Typography>
    </div>
  )
}

export default SensorDataView