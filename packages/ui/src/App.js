import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <label for="discordWebhookUrl">Discord Webhook URL</label>
      <input type="text" id="discordWebhookUrl" name="discordWebhookUrl" />
    </div>
  );
}

export default App;
