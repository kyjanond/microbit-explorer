/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { useSelector } from 'react-redux'
import Typography from '@mui/material/Typography'
import { selectDeviceInfo } from './deviceInfoSlice'

export interface IDeviceInfo {
  className?:string
}

const DeviceInfo = (props:IDeviceInfo)=>{
  const deviceInfo = useSelector(selectDeviceInfo)
  return(
    <div className={`${props.className?props.className:' device-info'}`}>
      <Typography variant='body2'>
        ID&nbsp;&nbsp;&nbsp;: {deviceInfo.id}
      </Typography>
      <Typography variant='body2'>
        NAME&nbsp;: {deviceInfo.name}
      </Typography>
      <Typography variant='body2'>
        MODEL: {deviceInfo.modelNr}
      </Typography>
      <Typography variant='body2'>
        FW&nbsp;&nbsp;&nbsp;: {deviceInfo.fwRev}
      </Typography>
    </div>
  )
}

export default DeviceInfo