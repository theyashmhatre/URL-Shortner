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
    token: localStorage === null ? undefined : localStorage.getItem("auth-token"),
    user: localStorage === null ? undefined : {
      id: localStorage.getItem("id"),
      name: localStorage.getItem("username")
    },
  });


  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = userData.token;
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
        const userRes = await Axios.get("/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
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
            <Route exact path="/" component={HomePage}></Route>
            <Route exact path="/login" component={LoginPage}></Route>
            <Route exact path="/register" component={RegisterPage}></Route>
            <Route exact path="/create" component={CreateURLPage}></Route>
          </Switch>

        </BrowserRouter>
      </UserContext.Provider>

    </div>
  );
}

export default App;