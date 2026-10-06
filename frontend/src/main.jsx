import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import SplashScreen from "./components/SplashScreen";

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
     <SplashScreen />
      <App />
    </BrowserRouter>
  </HelmetProvider>
)