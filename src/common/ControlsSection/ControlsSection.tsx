/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import './controlsSection.scss'
import { Button, Typography, Collapse } from '@mui/material'

export interface IControlsSection {
  className?:string
  children?:React.ReactNode
  header:string
}
const ControlsSection = (props:IControlsSection)=>{
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandClick = ()=>{
    setExpanded(!expanded)
  }
  return(
    <div className={`${props.className?props.className:''} controls-section`}>
      <div onClick={handleExpandClick} className='controls-section__header'>
        <Button 
          disableRipple
          className={`controls-section__button${expanded?' controls-section__button--expanded':''}`}
          variant='text' 
          onClick={handleExpandClick}
        >
          {'>'}
        </Button>
        <Typography variant='subtitle1'>{props.header}</Typography>
      </div>
      <Collapse 
        in={expanded} 
        timeout="auto" 
      >
        {props.children}
      </Collapse>
    </div>
  )
}

export default ControlsSection