import React, { useState, useContext, useEffect } from "react";
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

    const [notif, setNotif] = useState();

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

        try {
            const newUser = {
                email: user.email,
                password: user.password,
                passwordCheck: user.passwordCheck,
                name: user.name
            };

            const userReg = await Axios.post(
                "/users/register",
                newUser
            );
            setNotif(userReg.data.msg);
            console.log(userReg);
            setUser({
                name: "",
                email: "",
                password: "",
                passwordCheck: ""
            });
        } catch (err) {
            err.response.data.msg && setNotif(err.response.data.msg);
        }
    };

    useEffect(() => {
        if (userData.token) { history.push("/create"); }
    });

    return (
        < div >
            <h1 className="heading-top">Register</h1>
            <div>
                <h5>Already registered? <Link to="/login">Log In</Link></h5>
            </div>

            {notif && <ErrorNotice message={notif} clearError={() => setNotif(undefined)} />}

            <Col xs={10} md={6} lg={5} style={{ margin: "auto" }}>
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