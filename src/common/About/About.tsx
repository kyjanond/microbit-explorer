/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import './about.scss'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import { Popover, Typography } from '@mui/material'

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
      >
        <div className='about__content'>
          <Typography>
            This is about
          </Typography>
          <Typography>
            Legend
          </Typography>
        </div>
      </Popover>
    </div>
  )
}

export default About