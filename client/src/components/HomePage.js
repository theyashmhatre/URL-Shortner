import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import UserContext from "../context/UserContext";

function HomePage() {
    const { userData, setUserData } = useContext(UserContext);
    const [username, setUsername] = useState();

    const history = useHistory();
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined,
        });
        localStorage.setItem("auth-token", "");
        localStorage.setItem("username", "");
        localStorage.setItem("id", "");
    };

    const setName = () => {
        setUsername(localStorage.getItem("username"));
    };

    useEffect(() => {
        if (!userData.token) { history.push("/login"); setUsername(""); }
        else { setName(); }
    });
    return (
        <div>

            <div>
                <h1 className="heading-top">Welcome to URL Shortner, {username}</h1>
            </div>
            <div className="text-center"><button onClick={logout} className="btn btn-dark">Logout</button></div>
        </div>
    );
}

export default HomePage;