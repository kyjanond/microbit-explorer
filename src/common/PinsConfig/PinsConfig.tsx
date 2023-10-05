/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import './pinsConfig.scss'
import { useState } from 'react'
import ControlsSection from '../ControlsSection/ControlsSection'

export interface IPinState {
  isUndefined:boolean
  isInput:boolean
  isAnalog:boolean
}

interface IPinControlProps {
  number:number,
  label:string,
  io: 'input' | 'output' | 'undefined',
  ad: 'analog' | 'digital' | 'undefined',
  onIOChange:(e:React.MouseEvent<HTMLElement>,newValue:string)=>void,
  onADChange:(e:React.MouseEvent<HTMLElement>,newValue:string)=>void
}

const PinControl = (props:IPinControlProps)=>{
  return(
    <ControlsSection header={props.label}>
      <div className='pin-control'>
        <ToggleButtonGroup
          color="primary"
          exclusive
          size='small'
          aria-labelledby={`pin${props.number}-control-input-group`}
          value={props.io}
          onChange={props.onIOChange}
        >
          <ToggleButton value='input'>Input</ToggleButton>
          <ToggleButton value='output'>Output</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="info"
          exclusive
          size='small'
          aria-labelledby={`pin${props.number}-control-type-group`}
          value={props.ad}
          onChange={props.onADChange}
        >
          <ToggleButton value='analog'>Analog</ToggleButton>
          <ToggleButton value='digital'>Digital</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </ControlsSection>
  )
}

export interface IPinsSettingProps {
  className?:string,
  isConnected: boolean,
  pinStates:{[key:number]:IPinState},
  onSaveClick: (pinIOMask:Uint32Array, pinADMask:Uint32Array)=>void,
  onReloadClick: ()=>void
}

interface INewPinState extends IPinState {
  changed:boolean
}

const PinsConfig = (props:IPinsSettingProps)=>{
  const [changed,setChanged] = useState(false)
  const [newPinStates,setNewPinStates] = useState({} as {[key:number]:INewPinState})
  React.useEffect(()=>{
    const pinStates = {} as typeof newPinStates
    Object.entries(props.pinStates).forEach(([k,v])=>{
      pinStates[Number(k)] = {
        ...v,
        changed: false
      }
    })
    setNewPinStates(pinStates)
    setChanged(false)
  },[props.pinStates])
  const handleChange = (pinNr: number, isInput?: boolean, isAnalog?: boolean) => {
    const newState:INewPinState = {
      changed: true,
      isUndefined: false,
      isInput: isInput ?? newPinStates[pinNr].isInput,
      isAnalog: isAnalog ?? newPinStates[pinNr].isAnalog
    }
    console.debug(newState)
    setNewPinStates({
      ...newPinStates,
      [pinNr]:newState
    })
    setChanged(true)
  }
  const handleSaveClicked = ()=>{
    const pinIOMask = new Uint32Array([0])
    const pinADMask = new Uint32Array([0])
    Object.entries(newPinStates).forEach(([k,v])=>{
      const pinNr = Number(k)
      if (!v.isUndefined && v.isInput) {
        pinIOMask[0] |= 1 << pinNr
      }
      if (!v.isUndefined && v.isAnalog) {
        pinADMask[0] |= 1 << pinNr
      }
      
    })
    props.onSaveClick(pinIOMask,pinADMask)
  }
  const handleReloadClicked = ()=>{
    props.onReloadClick()
  }
  return(
    <div className={`${props.className?props.className:''} pins-setting`}>
      {Object.entries(newPinStates).map(([k,v])=>{
        const pinNr = Number(k)
        const pinProps:IPinControlProps = {
          label: `PIN${k} `,
          number: pinNr,
          io: 'undefined',
          ad: 'undefined',
          onIOChange: (e,newValue)=>handleChange(pinNr,newValue==='input',undefined),
          onADChange: (e,newValue)=>handleChange(pinNr,undefined,newValue==='analog')
        }
        if (!v.isUndefined) {
          pinProps.label+=`${v.isAnalog?'A':'D'}${v.isInput?'I':'O'}${v.changed?' changed':''}`
          pinProps.io = v.isInput?'input':'output'
          pinProps.ad = v.isAnalog?'analog':'digital'
        }
        return <PinControl key={`pin-control-${k}`} {...pinProps}/>
      })}
      <div className='pins-config-button-wrapper'>
        <Button 
          size="small" 
          variant='outlined' 
          disableElevation 
          disabled={!props.isConnected || !changed}
          onClick={handleReloadClicked}
        >Reload</Button>
        <Button 
          size="small" 
          variant='outlined' 
          disableElevation 
          disabled={!props.isConnected || !changed}
          onClick={handleSaveClicked}
        >Save</Button>
      </div>
    </div>
  )
}

export default PinsConfig