/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import './about.scss'
import { IconButton, Popover, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { ACC_HELPER_COLOR, MAG_HELPER_COLOR } from '../../app/constants'
import GitHubButton from 'react-github-btn'

export interface IAboutProps {
  className?:string,
}

const About = (props:IAboutProps)=>{
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>)=>{
    setAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  return(
    <div>
      <IconButton 
        className={`${props.className?props.className:''} about__btn`}
        onClick={handlePopoverOpen}
      >
        <InfoIcon />
      </IconButton>
      <Popover 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }} 
        elevation={0}
        open={open}   
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        slotProps={{paper:{variant:'outlined'}}}
      >
        <div className='about__content'>
          <Typography variant='h6'>
            Legend
          </Typography>
          <Typography className='about__row' variant='caption'>
            <HorizontalRuleIcon className={'about__row-icon'} sx={{color:'#ff0000'}}/> X Axis
          </Typography>
          <Typography className='about__row' variant='caption'>
            <HorizontalRuleIcon className={'about__row-icon'} sx={{color:'#00ff00'}}/> Y Axis
          </Typography>
          <Typography className='about__row' variant='caption'>
            <HorizontalRuleIcon className={'about__row-icon'} sx={{color:'#0000ff'}}/> Z Axis
          </Typography>
          <Typography className='about__row' variant='caption'>
            <ArrowRightAltIcon className={'about__row-icon'} sx={{color:MAG_HELPER_COLOR}}/> Magnetometer vector
          </Typography>
          <Typography className='about__row' variant='caption'>
            <ArrowRightAltIcon className={'about__row-icon'} sx={{color:ACC_HELPER_COLOR}}/> Accelerometer vector
          </Typography>
          <Typography variant='h6'>
            How to use the Explorer
          </Typography>
          <Typography component={'ul'} className='about__how-to'>
            <li>Use your mouse or touch to move and rotate the scene.</li>
            <li>Connection status and controls are in the top left corner.</li>
            <li>Pins need to be configured before the values can be set or read.</li>
          </Typography>
          <Typography variant='h6'>
            The micro:bit code
          </Typography>
          <Typography component={'p'} className='about__paragraph'>
            You need a special project running on the micro:bit to be able to use the Explorer. You can download the project .hex file from&nbsp; 
            <a href="https://github.com/kyjanond/microbit-explorer/blob/main/doc/microbit/microbit-basic_ble.hex" target='_blank' rel="noreferrer noopener">here</a>
            &nbsp;OR you can use the python code from&nbsp; 
            <a href="https://github.com/kyjanond/microbit-explorer/blob/main/doc/microbit/microbit-basic_ble.py" target='_blank' rel="noreferrer noopener">here</a>.
            <br/>
            The microbit can be programed from the&nbsp;
            <a href="https://makecode.microbit.org/" target='_blank' rel="noreferrer noopener">MakeCode</a>
            &nbsp;interface.
          </Typography>
          <br/>
          <Typography variant='caption'>
            Created for educational purposes. No guarantees.
          </Typography>
          <br/>
          <br/>
          <GitHubButton href="https://github.com/kyjanond/microbit-explorer">View on Github</GitHubButton>
        </div>
      </Popover>
    </div>
  )
}

export default About