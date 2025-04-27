import React from 'react';
import { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import {Auth0Provider} from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-1030jwn6paz7xypp.us.auth0.com"
      clientId="tX0VaFPlWDdJSXjkc2Gd38km2WynHNBl"
      authorizationParams={{
          audience: "https://petoVibe/api",
        redirect_uri: window.location.origin + '/home',
      }}
    >
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
)
