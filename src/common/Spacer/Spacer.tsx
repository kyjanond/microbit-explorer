/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { Typography } from '@mui/material'
import './spacer.scss'

export interface ISpacerProps {
  className?:string
  length:number
}

const Spacer = (props:ISpacerProps)=>{
  return(
    <Typography 
      className={`${props.className?props.className:''} spacer`} 
      variant='body2'
    >{''.padStart(props.length,'-')}</Typography>
  )
}

export default Spacer