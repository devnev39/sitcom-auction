import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ComponentSelectionProvider } from './context/componentSelection.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js';
import { AlertContextProvider } from './context/AlertContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <UserContextProvider>
          <AlertContextProvider>
            <ComponentSelectionProvider>
              <ThemeProvider theme={theme}>
                <App />
              </ThemeProvider>
            </ComponentSelectionProvider>
          </AlertContextProvider>
      </UserContextProvider>
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>,
)
