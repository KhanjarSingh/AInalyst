import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import SearchPage from './SearchPage'
import ResultsPage from './ResultsPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results/:company" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
