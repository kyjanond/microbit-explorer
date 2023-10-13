/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react'
import './alertDialog.scss'
import { Dialog, DialogContent, Alert, AlertTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { AlertDialogContext } from './AlertDialogContext'



export interface IAlertDialogProps {
  className?:string,
}

const AlertDialog = (props:IAlertDialogProps)=>{
  const { open, alertDialogData, handleAlertDialog } = React.useContext(AlertDialogContext)
  const handleAlertClose = ()=>{
    handleAlertDialog(false)
  }
  return(
    <Dialog
      className={`${props.className?props.className:''} alert-dialog`}
      open={open}
      onClose={handleAlertClose}
    >
      <DialogContent className='alert-dialog__content'>
        <Alert 
          variant="standard" 
          severity={alertDialogData.severenity}
          action={
            <IconButton onClick={handleAlertClose} autoFocus>
              <CloseIcon/>
            </IconButton>
          }
        >
          <AlertTitle><strong>{alertDialogData.severenity?.toUpperCase()}</strong></AlertTitle>
          {alertDialogData.message}
        </Alert>
      </DialogContent>
    </Dialog>
  )
}

export default AlertDialog