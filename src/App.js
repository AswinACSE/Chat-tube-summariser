import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import ChatBotPage from './ChatBotPage'
import RecommendationChatbot from './RecommendationChatbot';
import Transcript from './Transcript';
import Help from './Help'
import './index.css';

function App() {
  return (
    <Router>
      <div className="mainbox">
        <div className="top-bar">
          <nav>
            <h1>ED-HUNT</h1>
            <ul>
              <li><Link to="/" className="active-link" activeClassName="active">Home</Link></li>
              <li><Link to="/transcript" className="active-link" activeClassName="active">Transcribe</Link></li>
              <li><Link to="/help" className="active-link" activeClassName="active">Help</Link></li>
              {/* Add other navigation links */}
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<ChatBotPage />} />
          <Route path="/transcript" element={<Transcript />} />
          <Route path="/help" element={<Help />} />
          {/* Add other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
