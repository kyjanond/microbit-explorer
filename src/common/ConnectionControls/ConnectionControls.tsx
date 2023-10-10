/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import './connectionControls.scss'
import { Button } from '@mui/material'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled'


export interface IConnectionControls {
  className?:string,
  isConnected: boolean,
  onConnectClick: ()=>void,
  onDisconnectClick: ()=>void
}

const ConnectionControls = (props:IConnectionControls)=>{
  return(
    <div className={`${props.className?props.className:''} connection-controls`}>
      {
        props.isConnected?<BluetoothIcon color="success" />:<BluetoothDisabledIcon color="error" />
      }
      <Button 
        size="small" 
        variant='outlined' 
        disableElevation 
        onClick={props.onConnectClick}
      >Connect</Button>
      <Button 
        size="small" 
        variant='outlined' 
        disableElevation 
        disabled={!props.isConnected} 
        onClick={props.onDisconnectClick}
      >Disconnect</Button>
    </div>
  )
}

export default ConnectionControls