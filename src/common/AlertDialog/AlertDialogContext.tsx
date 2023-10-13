/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import { AlertProps } from '@mui/material'
import AlertDialog from './AlertDialog'

const useAlertDialog = () => {
  const [open, setOpen] = React.useState(false)
  const [alertDialogData, setAlertDialogData] = React.useState(defaultAlertDialogData)

  const handleAlertDialog = (open:boolean, content?: IAlertDialogData) => {
    setOpen(open)
    if (content) {
      setAlertDialogData(content)
    }
  }

  return { open, alertDialogData, handleAlertDialog }
}

export interface IAlertDialogData {
  severenity: AlertProps['severity'],
  message: string
}

const defaultAlertDialogData:IAlertDialogData = {
  severenity: 'info' as AlertProps['severity'],
  message: ''
}

const initialAlertDialogContext = {
  open:false,
  alertDialogData:defaultAlertDialogData,
  handleAlertDialog: (_open:boolean, _content?: IAlertDialogData)=>{}
}
const AlertDialogContext = React.createContext(initialAlertDialogContext)

interface IAlertDialogProvider {
  children?:React.ReactNode
}

const AlertDialogProvider = (props:IAlertDialogProvider) => {
  const { open, alertDialogData, handleAlertDialog } = useAlertDialog()
  return (
    <AlertDialogContext.Provider value={{ open, alertDialogData, handleAlertDialog }}>
      <AlertDialog/>
      {props.children}
    </AlertDialogContext.Provider>
  )
}

export { AlertDialogContext, AlertDialogProvider }