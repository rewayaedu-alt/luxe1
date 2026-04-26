import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { AuthProvider } from '@/lib/AuthContext'
import '@/index.css'

if (window.location.hostname === '127.0.0.1') {
  const canonicalUrl = new URL(window.location.href)
  canonicalUrl.hostname = 'localhost'
  window.location.replace(canonicalUrl.toString())
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
