import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import CreateURLPage from "./components/CreateURLPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Axios from "axios";
import UserContext from "./context/UserContext";
import Header from './components/Layout/Header';

function App() {

  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        const userRes = await Axios.get(
          "/users/",
          {
            headers: { "x-auth-token": token }
          });
        setUserData({
          token,
          user: userRes.data,

        });
        console.log(userRes);
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <div className="App">

      <UserContext.Provider value={{ userData, setUserData }}>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route path="/" exact component={HomePage}></Route>
            <Route path="/login" exact component={LoginPage}></Route>
            <Route path="/register" exact component={RegisterPage}></Route>
            <Route path="/create" exact component={CreateURLPage}></Route>
          </Switch>

        </BrowserRouter>
      </UserContext.Provider>

    </div>
  );
}

export default App;