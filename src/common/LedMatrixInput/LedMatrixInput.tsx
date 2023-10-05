/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { Button, Checkbox, TextField } from '@mui/material'
import './ledMatrixInput.scss'
import { useState } from 'react'
import SquareRoundedIcon from '@mui/icons-material/SquareRounded'
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded'

interface ILedCellProps {
  checked:boolean,
  disabled?:boolean
  row:number,
  col:number,
  onChange: (row:number,col:number,state:boolean)=>void
}

const LedCell = (props:ILedCellProps)=>{
  const [checked,setChecked] = useState(props.checked)
  const handleChecked = (e:React.ChangeEvent<HTMLInputElement>)=> {
    setChecked(e.target.checked)
    props.onChange(props.row,props.col,e.target.checked)
  }
  return(
    <Checkbox disabled={props.disabled ?? false} className='led-cell' disableRipple onChange={handleChecked} checked={checked} icon={<CropSquareRoundedIcon />} checkedIcon={<SquareRoundedIcon />}/>
  )
}

export interface ILedMatrixInputProps {
  className?:string,
  isConnected: boolean,
  onSendClick: (ledStateArray:Uint8Array)=>void,
}

const LedMatrixInput = (props:ILedMatrixInputProps)=>{
  const rowCount = 5
  const colCount = 5
  const [ledStateArray,setLedStateArray] = useState(new Uint8Array(rowCount))
  const handleLedStateChange = (rowIndex:number,colIndex:number,state:boolean)=>{
    const newLedState = ledStateArray.map((col,i)=>{
      if(i===rowIndex){
        const mask = 1 << (colCount-colIndex-1)
        if (state){
          return col | mask
        } else {
          return col & ~mask
        }
      } else{
        return col
      }
    })
    setLedStateArray(newLedState)
    console.debug(newLedState)
  }
  return(
    <div className={`${props.className?props.className:''} led-matrix-input`}>
      <div className='led-matrix'>
        {[...Array(rowCount)].map((_x,row:number)=>
          [...Array(colCount)].map((_y,col:number)=><LedCell 
            disabled={!props.isConnected}
            key={`led${row}-${col}`} 
            checked={false} 
            row={row} 
            col={col} 
            onChange={handleLedStateChange}/>
          )
        )}
      </div>
      <Button 
        size="small" 
        variant='outlined' 
        disableElevation 
        disabled={!props.isConnected}
        onClick={()=>props.onSendClick(ledStateArray)}
      >Send</Button>
    </div>
  )
}

export default LedMatrixInput