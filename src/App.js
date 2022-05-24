import "./App.css";
import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Header from './components/Header'
import Menu from './pages/Menu'
// import NotFound from './pages/NotFound'
 
function App() {
    return (
          <Switch>
            <Route exact path="/"> 
              <Login/>
            </Route>
            <Route path="/register"> 
              <Register/>
            </Route>
            <Route path="/home"> 
              <Header/>
              <Home/>
            </Route>
            <Route path="/menu"> 
              <Header/>
              <Menu/>
            </Route>
          </Switch>
    )
}

export default App;
