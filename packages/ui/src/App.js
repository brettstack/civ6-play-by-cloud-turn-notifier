import React, { useEffect, useState, createContext, useContext } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Amplify, { Auth } from 'aws-amplify'
import ClassicCreateWebhookPage from './pages/ClassicCreateWebhookPage'
import ClassicGamePage from './pages/ClassicGamePage'
import HomePage from './pages/HomePage'
import AuthenticatedApp from './AuthenticatedApp'

const {
  REACT_APP_ApiEndpoint,
  REACT_APP_CognitoIdentityPoolId,
  REACT_APP_CognitoUserPoolId,
  REACT_APP_CognitoUserPoolClientId,
} = process.env

// Set Authorization header on all requests if user is signed in
axios.interceptors.request.use(async function (config) {
  try {
    const currentUserSession = await Auth.currentSession()
    const Authorization = currentUserSession.idToken.jwtToken
    config.headers.Authorization = Authorization
  } catch (e) { /* Auth.currentSession() throws if not signed in 🤷‍♂️ */ }

  return config
})
axios.defaults.baseURL = REACT_APP_ApiEndpoint

Amplify.configure({
  Auth: {
    // region: process.env.region,
    identityPoolId: REACT_APP_CognitoIdentityPoolId,
    userPoolId: REACT_APP_CognitoUserPoolId,
    userPoolWebClientId: REACT_APP_CognitoUserPoolClientId,
  },
})

const authContext = createContext()
function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}

function useAuth() {
  return useContext(authContext)
}

function useProvideAuth() {
  const [auth, setAuth] = useState()
  useEffect(() => {
    async function fetchAndSetUsers() {
      const currentUserSession = await Auth.currentSession()
      console.log('currentUserSession', currentUserSession)
      setAuth(currentUserSession)
    }
    fetchAndSetUsers()
  }, [])

  // const signin = cb => {
  //   return fakeAuth.signin(() => {
  //     setUser("user")
  //     cb()
  //   })
  // }

  // const signout = cb => {
  //   return fakeAuth.signout(() => {
  //     setUser(null)
  //     cb()
  //   })
  // }

  return {
    auth,
    // signin,
    // signout
  }
}


function AuthenticatedRoute({ children, ...rest }) {
  let auth = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

function App() {
  return (
  <ProvideAuth>
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/classic">
          <ClassicCreateWebhookPage />
        </Route>
        <Route exact path="/classic/games/:gameId">
          <ClassicGamePage />
        </Route>
        <AuthenticatedRoute exact path="/games/:gameId">
          <ClassicCreateWebhookPage />
        </AuthenticatedRoute>
        <Route path="/app">
          <AuthenticatedApp />
        </Route>
      </Switch>
    </Router>
    </ProvideAuth>
  )
}

export default App
