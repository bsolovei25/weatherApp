import React from 'react';
import Header from "./shared/header/Header.tsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./core/home/Home.tsx";
import './App.scss'

const App: React.FC = () => {
  return (
      <Router>
          <div className="App">
              <Header></Header>
              <Routes>
                  <Route path="/" element={<Home />} />
              </Routes>
          </div>
      </Router>
  );
};

export default App;