/**
 * Application Entry Point
 * 
 * This file is the entry point for the React application.
 * It renders the root App component into the DOM.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render the App component into the root div element
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

