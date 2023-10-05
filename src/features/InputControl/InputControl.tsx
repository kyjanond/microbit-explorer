/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import ControlsSection from '../../common/ControlsSection/ControlsSection'
import LedTextInput from '../../common/LedTextInput/LedTextInput'
import LedMatrixInput from '../../common/LedMatrixInput/LedMatrixInput'
import { writeCharacteristic } from '../../app/ble'
import { ledService, pinService } from '../../app/microbitBleServices'
import { useSelector, shallowEqual } from 'react-redux'
import { selectPinConfigFiltered } from '../DeviceConfig/deviceConfigSlice'
import PinValuesInput from '../../common/PinValueInput/PinValueInput'

export interface IPinValuesInput {
  className?:string,
  connected: boolean,
  pinFilter: number[],
}

const InputControl = (props:IPinValuesInput)=>{
  const pinConfig = useSelector(selectPinConfigFiltered(props.pinFilter),shallowEqual )
  const handleSendTextClick = (textArray:Uint8Array)=>{
    writeCharacteristic(
      ledService.uuid,
      ledService.characteristics.text.uuid,
      textArray.buffer
    )
  }
  const handleSendLedMatrixClick = (ledStateArray:Uint8Array)=>{
    writeCharacteristic(
      ledService.uuid,
      ledService.characteristics.matrixState.uuid,
      ledStateArray.buffer
    )
  }
  const handleSendPinValuesClick = (pinValues:Uint8Array)=>{
    writeCharacteristic(
      pinService.uuid,
      pinService.characteristics.pinData.uuid,
      pinValues.buffer
    )
  }
  return(
    <div className={`${props.className?props.className:''} input-control`}>
      <ControlsSection 
        header={'LED TEXT'}>
        <LedTextInput isConnected={props.connected} onSendClick={handleSendTextClick}/>
      </ControlsSection>
      <ControlsSection 
        header={'LED MATRIX'}>
        <LedMatrixInput isConnected={props.connected} onSendClick={handleSendLedMatrixClick}/>
      </ControlsSection>
      <ControlsSection 
        header={'PINS'}>
        <PinValuesInput isConnected={props.connected} pinConfig={pinConfig} onSendClick={handleSendPinValuesClick}/>
      </ControlsSection>
    </div>
  )
}

export default InputControl