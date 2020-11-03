import React from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage'

// Consider using https://www.npmjs.com/package/@beam-australia/react-env instead
// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4911/' : 'https://api.civ.halfstack.software'
axios.defaults.baseURL = 'https://api.civ.halfstack.software'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/game/:gameId">
          <GamePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
