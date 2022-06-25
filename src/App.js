import "./App.css";
import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Header from './components/Header'
import Ledger from './components/Ledger'
import Account from './pages/Account'
import Settings from './pages/Settings'
import Footer from "./components/Footer";
import Notes from "./pages/Notes";
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
              <Footer/>
            </Route>
            <Route path="/ledger"> 
              <Header/>
              <Ledger/>
            </Route>
            <Route path="/account"> 
              <Header/>
              <Account/>
            </Route>
            <Route path="/settings"> 
              <Header/>
              <Settings/>
              <Footer/>
            </Route>
            <Route path="/notes"> 
              <Header/>
              <Notes/>
            </Route>
          </Switch>
    )
}

export default App;
