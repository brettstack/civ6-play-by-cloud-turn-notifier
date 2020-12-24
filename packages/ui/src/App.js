import React from 'react'
import axios from 'axios'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import GamePage from './pages/GamePage'
import HomePage from './pages/HomePage'

const {
  REACT_APP_ApiEndpoint,
} = process.env

// Consider using https://www.npmjs.com/package/@beam-australia/react-env instead
// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4911/' : REACT_APP_ApiEndpoint//'https://api.civ.halfstack.software'
axios.defaults.baseURL = REACT_APP_ApiEndpoint

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
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
    </ThemeProvider>
  )
}

export default App
