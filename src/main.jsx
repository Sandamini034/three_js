import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HashRouter, Route, Routes} from 'react-router-dom'
import Assignment_1 from "./Assignments/three_js/Assignment_1.jsx";
import Home from "./Assignments/Home/Home.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ASG-01" element={<Assignment_1 />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
