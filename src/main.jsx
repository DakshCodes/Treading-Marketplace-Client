import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import {
  RecoilRoot,
} from 'recoil';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NextUIProvider>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </NextUIProvider>
    </BrowserRouter>
  </React.StrictMode >,
)
