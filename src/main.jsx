import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import store from './store'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import 'simplebar-react/dist/simplebar.min.css'
import 'flatpickr/dist/themes/material_red.css'
import '../src/assets/scss/app.scss'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  </>
)
