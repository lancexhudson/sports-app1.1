// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SportPage from './pages/SportPage';
import './index.css';
import StandingsPage from './pages/StandingsPage';

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:sportId" element={<SportPage />} />
            <Route path="/:sportId/:tab" element={<SportPage />} />
            <Route path="/standings" element={<StandingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
