import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BusinessProvider } from './context/BusinessContext'
import { PrimeReactProvider } from 'primereact/api'
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <PrimeReactProvider>
      <BusinessProvider>
        <App />
      </BusinessProvider>
    </PrimeReactProvider>
  </StrictMode>,
)
