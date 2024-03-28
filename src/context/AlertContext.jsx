import * as React from 'react';

import { createContext } from "react";

export const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState('error');

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const OpenAlert = (message, severity) => {
        setMessage(message);
        setSeverity(severity);
        handleClick();
    }

    return (
        <AlertContext.Provider value={{OpenAlert, open, handleClose, message, severity}}>
            {children}
        </AlertContext.Provider>
    )
}
