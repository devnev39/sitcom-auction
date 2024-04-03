import { Alert, Snackbar } from '@mui/material'
import React, { useContext } from 'react'
import { AlertContext } from '../context/AlertContext'

export default function CommonAlert() {
    const {open, handleClose, message, severity} = useContext(AlertContext);

  return (
    <>
    <Snackbar
    open={open}
    autoHideDuration={2000}
    onClose={handleClose}
    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
    >
      <Alert severity={severity}>
          {message}
      </Alert>
    </Snackbar>
    </>
  )
}
