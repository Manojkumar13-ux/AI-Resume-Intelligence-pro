import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './app/routes/home';
import Results from './app/routes/results';
import MyData from './app/routes/my-data';
import Resumes from './app/routes/resumes';
import ResumeDetail from './app/routes/resume-detail';
import Auth from './app/routes/auth';
import './app/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/my-data" element={<MyData />} />
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/resume/:id" element={<ResumeDetail />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);