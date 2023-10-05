/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { Button, TextField } from '@mui/material'
import './ledTextInput.scss'
import { useState } from 'react'

export interface ILedTextInput {
  className?:string,
  isConnected: boolean,
  onSendClick: (textArray:Uint8Array)=>void,
}

const LedTextInput = (props:ILedTextInput)=>{
  const encoder = new TextEncoder()
  const [text,setText] = useState(new Uint8Array())
  const [error,setError] = useState(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(encoder.encode(event.target.value))
    setError(text.byteLength>20)
  }
  return(
    <div className={`${props.className?props.className:''} led-text-input`}>
      <TextField 
        fullWidth
        error={error} 
        helperText={error?'Text too long':''}
        id="microbit-input-text" 
        label="text" 
        size="small"
        variant="outlined" 
        disabled={!props.isConnected}
        onChange={handleChange}
      />
      <Button 
        size="small" 
        variant='outlined' 
        disableElevation 
        disabled={!props.isConnected}
        onClick={()=>props.onSendClick(text)}
      >Send</Button>
    </div>
  )
}

export default LedTextInput