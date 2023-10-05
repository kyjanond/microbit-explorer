import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './style/_style.scss'
import store from './app/store.ts'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: grey[800],
    },
    secondary: {
      main: grey[500],
    },
    info: {
      main: grey[900]
    }
  },
  typography: {
    fontFamily: [
      'Consolas',
      'sans-serif'
    ].join(','),
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
