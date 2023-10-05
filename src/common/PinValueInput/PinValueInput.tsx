/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import './pinValueInput.scss'
import { useState } from 'react'
import { VolumeUp } from '@mui/icons-material'
import { IPinState } from '../PinsConfig/PinsConfig'

interface IInputProps {
  value:number
  onChange: (value:number)=>void
}

const AnalogInput = (props:IInputProps)=>{
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    props.onChange(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value === '' ? 0 : Number(event.target.value))
  }
  return(
    <div className='da-input'>
      <TextField
        variant="outlined"
        value={props.value}
        size="small"
        onChange={handleInputChange}
        inputProps={{
          step: 1,
          min: 0,
          max: 255,
          type: 'number',
        }}
      />
      <Slider
        min={0}
        max={255}
        value={typeof props.value === 'number' ? props.value : 0}
        onChange={handleSliderChange}
      />
    </div>
  )
}

const DigitalInput = (props:IInputProps)=>{
  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: number) => {
    props.onChange(newValue)
  }

  return(
    <div className='da-input'>
      <ToggleButtonGroup
        color="info"
        value={props.value}
        exclusive
        onChange={handleChange}
        size='small'
      >
        <ToggleButton value={0}>LOW&nbsp;</ToggleButton>
        <ToggleButton value={255}>HIGH</ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}

export interface IPinValuesInput {
  className?:string,
  isConnected: boolean,
  pinConfig:{[k:string]:IPinState},
  onSendClick: (pinValues:Uint8Array)=>void,
}

const PinValuesInput = (props:IPinValuesInput)=>{
  const [pinValue,setPinValue] = useState(0)
  const [activePin,setActivePin] = useState('')
  const handlePinChange = (event: SelectChangeEvent) => {
    setActivePin(event.target.value as string)
    console.debug(props.pinConfig[activePin])
  }
  const handleSendClicked = ()=>{
    if (!activePin){
      return
    }
    const activePinNr = Number.parseInt(activePin)
    const pinValueArray = new Uint8Array([activePinNr,pinValue]) 
    props.onSendClick(pinValueArray)
  }
  const handlePinValueChange = (value:number)=>{
    if(value<0){
      value = 0
    } else if (value>255) {
      value = 255
    }
    setPinValue(value)
  }
  return(
    <div className={`${props.className?props.className:''} pin-value-input`}>
      <div className='pin-value-input-selection'>
        <FormControl size="small">
          <InputLabel id="pin-select-label">Pin</InputLabel>
          <Select
            labelId="pin-select-label"
            id="pin-select"
            value={activePin}
            label="Pin"
            onChange={handlePinChange}
          >
            {Object.keys(props.pinConfig).filter(k=>!props.pinConfig[k].isInput).map(k=><MenuItem key={k} value={k}>PIN{k}</MenuItem>)}
          </Select>
        </FormControl>
        {
          (activePin)?
            props.pinConfig[activePin].isAnalog?
              <AnalogInput value={pinValue} onChange={handlePinValueChange}/>:
              <DigitalInput value={pinValue} onChange={handlePinValueChange}/>
            :''
        }
      </div>
      <div className='pin-value-input-btn-wrapper'>
        <Button 
          size="small" 
          variant='outlined' 
          disableElevation 
          disabled={!props.isConnected}
          onClick={handleSendClicked}
        >Send</Button>
      </div>
    </div>
  )
}

export default PinValuesInput