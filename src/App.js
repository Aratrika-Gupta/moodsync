"use client"
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuroraBackgroundDemo} from './components/Hero';
import './App.css';
import { StoryGenerator } from './components/Generate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuroraBackgroundDemo />} />
        <Route path="/generate" element={<StoryGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
