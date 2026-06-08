import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HashRouter, Route, Routes} from 'react-router-dom'
import Assignment_1 from "./Assignments/Assignment_1/Assignment_1.jsx";
import Assignment_2 from "./Assignments/Assignment_2/Assignment_2.jsx";
import Assignment_3 from "./Assignments/Assignment_3/Assignment_3.jsx";
import Home from "./Assignments/Home/Home.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ASG-01" element={<Assignment_1 />} />
        <Route path="/ASG-02" element={<Assignment_2 />} />
        <Route path="/ASG-03" element={<Assignment_3 />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
