import React from 'react';
import banner from './wizeline-amplify-serverless-banner-transparent.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={banner} className="App-banner" alt="banner" />
        <p>
          Developed and maintained by <a href="https://www.wizeline.com/" target="_blank" className="App-link" rel="noopener noreferrer">Wizeline</a>.
            </p>
        <p>
          Wizeline understands that great software is built by great people and teams. If you’d like to partner with Wizeline to build your software or expand your existing team with veteran engineers, project managers, technical writers, <a href="https://www.wizeline.com/contact/" target="_blank" className="App-link" rel="noopener noreferrer">reach out to our team</a>.
            </p>
      </header>
    </div>
  );
}

export default App;
