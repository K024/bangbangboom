import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react-lite'
import { HashRouter as Router, Switch, Route } from "react-router-dom"
import { LocaleProvider } from './Global/Locale';
import { HomeFrame } from './Pages/HomeFrame';
import { DashboardFrame } from './Pages/DashboardFrame';
import { GlobalSnackbar } from './Global/Snackbar';
import { Home } from './Pages/MainPages/Home';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './Global/Theme';
import { CssBaseline } from '@material-ui/core';
// import { MappingPage } from './Mapping/MappingPage';
import { SearchPage } from './Pages/MainPages/Search';
import { FavoritesPage } from './Pages/MainPages/Favorites';
import { RegisterPage } from './Pages/MainPages/Register';
import { MapDetailPage } from './Pages/MainPages/MapDetail';
import { LoadCurrentUser } from './Pages/UserState';
import { ProfilePage } from './Pages/DashboardPages/Profile';
import { ForgotPassPage } from './Pages/MainPages/ForgotPass';
import { NotFoundPage } from './Pages/MainPages/NotFound';
import { MyMapsPage } from './Pages/DashboardPages/MyMaps';
import { asyncComponent } from "react-async-component"

const MappingPage = asyncComponent({
  resolve: () => import("./Mapping/MappingPage").then(m => m.MappingPage) as any
})

const App = () => {

  useEffect(() => {
    const loader = document.getElementById("loader")
    if (loader) document.body.removeChild(loader)
    LoadCurrentUser()
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
                  <Route path="/dashboard" exact><ProfilePage /></Route>
                  <Route path="/dashboard/mymaps"><MyMapsPage /></Route>
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
                  <Route path="/search"><SearchPage /></Route>
                  <Route path="/favorites"><FavoritesPage /></Route>
                  <Route path="/settings">Settings</Route>
                  <Route path="/register"><RegisterPage /></Route>
                  <Route path="/forgotpass"><ForgotPassPage /></Route>
                  <Route path="/map/:id"><MapDetailPage /></Route>
                  <Route path="/user/:id">User</Route>
                  <Route path="/pages/:id">Pages</Route>
                  <Route path="*"><NotFoundPage /></Route>
                </Switch>
              </HomeFrame>
            </Route>
          </Switch>
          <GlobalSnackbar />
        </Router>
      </ThemeProvider>
    </LocaleProvider>
  ))
}

export default App;
