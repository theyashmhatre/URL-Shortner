import React, { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import UserContext from "../context/UserContext";
import { useHistory, Link } from 'react-router-dom';
import ErrorNotice from "./Layout/ErrorNotice";
import { Form, Col } from "react-bootstrap";

export default function ForgotPassword() {
    const [notif, setNotif] = useState();
    const [user, setUser] = useState({ email: "" });
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
        setNotif(undefined);
        try {
            const userInfo = {
                email: user.email
            };

            const sentLink = await Axios.post(
                "/users/forgot",
                userInfo
            );

            setNotif(sentLink.data.msg);

        } catch (err) {
            err.response.data.msg && setNotif(err.response.data.msg);
        }
    };

    useEffect(() => {
        if (userData.token) history.push("/create");
    });

    return (
        <div style={{ paddingTop: "20px" }}>
            <h1 className="heading-top">Forgot Password</h1>
            {notif && <ErrorNotice message={notif} clearError={() => setNotif(undefined)} />}
            <Col xs={10} md={6} lg={5} style={{ margin: "auto" }}>
                <Form onSubmit={onSubmit} className="form">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            onChange={handleChange}
                            value={user.email} />
                        <Form.Text className="text-muted">
                            Verification Link will be sent to this email.
                    </Form.Text>
                    </Form.Group>
                    <div className="text-center"><input type="submit" value="Send Link" className="btn btn-primary" /></div>
                </Form>
            </Col>
        </div>
    )
}
