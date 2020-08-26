import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import UserContext from "../context/UserContext";

function HomePage() {
    const { userData, setUserData } = useContext(UserContext);
    const [username, setUsername] = useState();

    const history = useHistory();
    const register = () => history.push("/register");
    const login = () => history.push("/login");
    const logout = () => setUserData({
        token: undefined,
        user: undefined,
    });

    return (
        <div>

            <div>
                <h1 className="heading-top">Welcome to URL Shortner, {username}</h1>
            </div>
            {userData.user ? <div className="text-center" ><button onClick={login} className="btn btn-dark" style={{ paddingRight: "10px" }}>Log in</button><button onClick={register} className="btn btn-dark" style={{ paddingRight: "10px" }}>Register</button></div> :
                <div className="text-center"><button onClick={logout} className="btn btn-dark">Logout</button></div>}
        </div>
    );
}

export default HomePage;