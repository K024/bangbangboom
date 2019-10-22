import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react-lite'
import { HashRouter as Router, Switch, Route } from "react-router-dom"
import { LocaleProvider } from './Global/Locale';
import { HomeFrame } from './Pages/HomeFrame';
import { DashboardFrame } from './Pages/DashboardFrame';
import { GlobalSnackbar } from './Global/Snackbar';
import { ProgressBar } from './Global/Progress';
import { Home } from './Pages/MainPages/Home';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './Global/Theme';
import { CssBaseline } from '@material-ui/core';
import { MappingPage } from './Mapping/MappingPage';
import { LoginForm } from './Pages/Components/LoginForm';

const App = () => {

  useEffect(() => {
    const loader = document.getElementById("loader")
    if (loader) document.body.removeChild(loader)
  }, [])

  return useObserver(() => (
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route path="/dashboard">
              <DashboardFrame>
                <Switch>
                  <Route path="/dashboard" exact><LoginForm /></Route>
                  <Route path="/dashboard/mymaps">My maps</Route>
                  <Route path="/dashboard/reviewings">Reviewings</Route>
                  <Route path="/dashboard/users">Users</Route>
                  <Route path="/dashboard/allmaps">All maps</Route>
                </Switch>
              </DashboardFrame>
            </Route>
            <Route path="/game/:id">
              <div>Game</div>
            </Route>
            <Route path="/mapping">
              <MappingPage />
            </Route>
            <Route path="*">
              <HomeFrame>
                <Switch>
                  <Route path="/" exact><Home /></Route>
                  <Route path="/search">Search</Route>
                  <Route path="/favorites">Favorites</Route>
                  <Route path="/settings">Settings</Route>
                  <Route path="/register">Register</Route>
                  <Route path="/confirmemail">Confirm Email</Route>
                  <Route path="/forgotpass">Forgot Password</Route>
                  <Route path="/resetpass">Reset Password</Route>
                  <Route path="/map/:id">Map</Route>
                  <Route path="/user/:id">User</Route>
                  <Route path="/pages/:id">Pages</Route>
                  <Route path="*">Not found</Route>
                </Switch>
              </HomeFrame>
            </Route>
          </Switch>
          <GlobalSnackbar />
          <ProgressBar />
        </Router>
      </ThemeProvider>
    </LocaleProvider>
  ))
}

export default App;
