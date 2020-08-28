import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import UserContext from "../context/UserContext";
import { Row, Col } from "react-bootstrap";

function HomePage() {
    const { userData, setUserData } = useContext(UserContext);
    const [username, setUsername] = useState();

    const history = useHistory();
    const create = () => {
        history.push("/create");
    };
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
    }, []);
    return (
        <div>

            <div>
                <h1 className="heading-top">Welcome to URL Shortner, {username}</h1>
            </div>
            <div className="text-center">
                <Row className="justify-content-md-center">
                    <Col xs lg="2"><button onClick={create} className="btn btn-success" >Shorten URL</button></Col>
                    <Col xs lg="1"><button onClick={logout} className="btn btn-dark" >Logout</button></Col>
                </Row>
            </div>
        </div>
    );
}

export default HomePage;