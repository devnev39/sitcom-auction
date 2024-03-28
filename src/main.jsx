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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <UserContextProvider>
          <AlertContextProvider>
            <ComponentSelectionProvider>
              <App />
            </ComponentSelectionProvider>
          </AlertContextProvider>
      </UserContextProvider>
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>,
)
