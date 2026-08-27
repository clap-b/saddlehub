import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { APIProvider } from '@vis.gl/react-google-maps'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <App />
      </APIProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)