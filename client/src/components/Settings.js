import React, { useState, useContext, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserContext from "../context/UserContext";
import ErrorNotice from "./Layout/ErrorNotice";

export default function Settings() {

    const { userData, setUserData } = useContext(UserContext);
    const [userName, setUserName] = useState();
    const history = useHistory();
    const [notif, setNotif] = useState();
    const [deleted, setDeleted] = useState(false);
    const [user, setUser] = useState({
        email: ""
    });

    function handleChange(event) {
        const value = event.target.value;
        setUser({
            ...user,
            [event.target.name]: value
        });
    }

    function updateUserName() {
        setUserName(localStorage.getItem("username"));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setNotif(undefined);

        try {
            const userInfo = {
                id: localStorage.getItem("id"),
                email: user.email
            };

            let config = {
                headers: {
                    "x-auth-token": userData.token,
                }
            };

            const deleted = await Axios.post(
                "/users/delete",
                userInfo,
                config);
            setNotif(deleted.data.msg);

            if (deleted.status === 200) {
                setDeleted(true);

                localStorage.setItem("auth-token", "");
                localStorage.setItem("username", "");
                localStorage.setItem("id", "");

                let redirect = setTimeout(() => {
                    setUserData({
                        token: undefined,
                        user: undefined,
                    });
                    history.push("/login");
                }, 5000);
            }
        } catch (err) {
            err.response.data.msg && setNotif(err.response.data.msg);
        }
    };


    useEffect(() => {
        if (!userData.token) { history.push("/login"); }
        else { updateUserName(); }
    });
    return (

        <div style={{ paddingTop: "20px" }}>
            <h1 className="heading-top">Hello, {deleted ? "Deleted Successfully" : userName}!</h1>
            {notif && <ErrorNotice message={notif} clearError={() => setNotif(undefined)} />}
            <Col xs={10} md={6} lg={5} style={{ margin: "auto" }}>
                <Form onSubmit={onSubmit} className="form">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            autoComplete="email"
                            onChange={handleChange}
                            value={user.email} />
                        <Form.Text className="text-muted">
                            Once your click delete, you won't be able to retrieve your data.
                    </Form.Text>
                    </Form.Group>
                    <div className="text-center"><input type="submit" value="Delete Account" className="btn btn-danger" /></div>
                </Form>
            </Col>
        </div>
    )
}
