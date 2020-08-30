import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Col, Form } from "react-bootstrap";
import Loader from 'react-loader-spinner';
import Axios from "axios";
import ErrorNotice from "./Layout/ErrorNotice";


export default function PasswordReset() {

    const [user, setUser] = useState({
        password: "",
        passwordCheck: ""
    });

    const { id, token } = useParams();
    const [linkChecked, setLinkChecked] = useState(false);
    const [notif, setNotif] = useState();
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
            const newPassword = {
                password: user.password,
                passwordCheck: user.passwordCheck,
                id: id
            };

            const passwordResetDone = await Axios.post(
                "/users/reset/password",
                newPassword
            );
            console.log(passwordResetDone);

            setNotif(passwordResetDone.data.msg);

            if (passwordResetDone.status === 200) {
                let redirect = setTimeout(() => {
                    history.push("/login");
                }, 5000);
            }
        } catch (err) {
            err.response.data.msg && setNotif(err.response.data.msg);
        }
    };

    useEffect(() => {
        const confirmUser = async () => {
            const paramsVerification = await Axios.post(
                "/users/reset/verify/" + id + "/" + token
            );
            console.log(paramsVerification);

            if (paramsVerification.data.verify !== true) {
                setNotif(paramsVerification.data.msg);
                console.log(notif);
                console.log(paramsVerification.data.msg);
                let redirect = setTimeout(() => {
                    history.push("/login");
                }, 6000);
            }
            else { setLinkChecked(true); }
        };
        confirmUser();
    }, []);

    return (
        <div>
            <h1 className="heading-top">Password Reset</h1>


            {linkChecked ? (
                <div>
                    <div>{notif && <ErrorNotice message={notif} clearError={() => setNotif(undefined)} />}</div>
                    <Col xs={10} md={6} lg={5} style={{ margin: "auto" }}>
                        <Form onSubmit={onSubmit} className="form">
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    value={user.password} />
                            </Form.Group>
                            <Form.Group controlId="formBasicPasswordCheck">
                                <Form.Label>Re-Enter Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="passwordCheck"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    value={user.passwordCheck} />
                            </Form.Group>
                            <div className="text-center"><input type="submit" value="Reset" className="btn btn-primary" /></div>

                        </Form>
                    </Col></div>
            ) :
                <div>{notif && <ErrorNotice message={notif} clearError={() => setNotif(undefined)} />}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        padding: "20px"
                    }}>
                        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" /></div></div>}
        </div>
    )
}
