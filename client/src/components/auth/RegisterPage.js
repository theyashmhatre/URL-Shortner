import React, { useState, useContext } from "react";
import { Form, Col } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import { useHistory, Link } from 'react-router-dom';
import ErrorNotice from '../Layout/ErrorNotice';

function RegisterPage() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        passwordCheck: ""
    });

    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
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

        try {
            const newUser = {
                email: user.email,
                password: user.password,
                passwordCheck: user.passwordCheck,
                name: user.name
            };

            await Axios.post(
                "/users/register",
                newUser
            );

            const loginRes = await Axios.post(
                "/users/login",
                { email: user.email, password: user.password }
            );

            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });

            localStorage.setItem("auth-token", loginRes.data.token);
            history.push("/create");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };



    return (
        < div >
            <h1 className="heading-top">Register</h1>
            <div>
                <h5>Already registered? <Link to="/login">Log In</Link></h5>
            </div>

            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}

            <Col xs={8} md={6} lg={5} style={{ margin: "auto" }}>
                <Form onSubmit={onSubmit} className="form">
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            name="name"
                            onChange={handleChange}
                            value={user.name} />

                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            onChange={handleChange}
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
                            value={user.password} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPasswordCheck">
                        <Form.Label>Re-Enter Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="passwordCheck"
                            onChange={handleChange}
                            value={user.passwordCheck} />
                    </Form.Group>
                    <div className="text-center"><input type="submit" onSubmit={onSubmit} value="Register" className="btn btn-primary" /></div>

                </Form>
            </Col>

        </div >
    );
}

export default RegisterPage;