import { StrictMode } from 'react'
import { ThemeProvider } from 'next-themes'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <App />      
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
