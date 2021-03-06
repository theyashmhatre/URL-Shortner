import React, { useState, useContext, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import { useHistory, Link } from 'react-router-dom';
import ErrorNotice from "../Layout/ErrorNotice";
import Loader from "react-loader-spinner";

function LoginPage() {

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [notif, setNotif] = useState();
    const [buttonLoader, setButtonLoader] = useState(false);

    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();


    function handleChange(event) {
        const value = event.target.value;
        setUser({
            ...user,
            [event.target.name]: value
        });
    }


    const onSubmit = async (e) => {
        e.preventDefault();
        setButtonLoader(true);
        setNotif(undefined);

        try {
            const loginUser = {
                email: user.email,
                password: user.password,
            };



            const loginRes = await Axios.post(
                "/users/login",
                loginUser
            );

            if (loginRes.status === 200) {
                setUserData({
                    token: loginRes.data.token,
                    user: loginRes.data.user,
                });

                localStorage.setItem("auth-token", loginRes.data.token);
                localStorage.setItem("username", loginRes.data.user.name);
                localStorage.setItem("id", loginRes.data.user.id);
                history.push("/create");
            }

        } catch (err) {
            err.response.data.msg && setNotif(err.response.data.msg);
        }
        setButtonLoader(false);
    };

    useEffect(() => {
        if (userData.token) { history.push("/create"); }
    });

    return (
        < div >
            <h1 className="heading-top">Log In</h1>
            <div>
                <h5>Haven't registered yet? <Link to="/register">Register</Link></h5>
            </div>
            {notif && <ErrorNotice message={notif} clearError={() => setNotif(undefined)} />}

            <Col xs={10} md={6} lg={5} style={{ margin: "auto" }}>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            onChange={handleChange}
                            autoComplete="username"
                            value={user.email} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
    </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            autoComplete="current-password"
                            value={user.password} />
                    </Form.Group>
                    <p align="center">Forgot Password? <a href="/forgot/password">Click here</a></p>

                    <div className="text-center"><button type="submit" className="btn btn-primary">{buttonLoader ? <Loader type="ThreeDots" color="#00BFFF" height={30} width={40} /> : "Login"}</button></div>

                </Form>
            </Col>

        </div >
    );
}

export default LoginPage;