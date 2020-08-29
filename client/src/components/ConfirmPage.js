import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import Loader from 'react-loader-spinner';
import '../App.css';

export default function ConfirmPage(props) {
    const [msg, setMsg] = useState("");
    const [isConfirm, setIsConfirm] = useState(false);
    const [timeLeft, setTimeLeft] = useState(6);

    let redirect = null;

    const { id } = useParams();

    const history = useHistory();

    const login = () => history.push("/login");



    useEffect(() => {
        const confirmUser = async () => {
            let newId = id;
            const confirmed = await Axios.get(
                "/users/email/confirm/" + newId
            );

            setIsConfirm(true);
            redirect = setTimeout(() => {
                history.push("/login");
            }, 5000);

            setMsg(confirmed.data.msg);
        };
        if (!isConfirm) {
            confirmUser();
        }
        clearTimeout(redirect);
        const intervalId = setInterval(() => {

            setTimeLeft(timeLeft - 1);
        }, 1000);
        if (timeLeft < 1) {
            setTimeLeft(0);
        }
        return () => clearInterval(intervalId);

    }, [timeLeft]);




    return (
        <div>
            {isConfirm ? <div className="confirmPage">
                <h4 className="confirmPgHead">{msg}</h4>
                <p>You will be redirected to the Login page in {timeLeft} seconds. If not redirected, please <a href="" onClick={login}>click here.</a></p>
            </div>
                :
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    padding: "20px"
                }}><Loader type="ThreeDots" color="#2BAD60" height="100" width="100" /></div>}
        </div>
    )
}
