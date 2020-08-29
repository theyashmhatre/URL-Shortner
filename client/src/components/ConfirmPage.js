import React, { useState, useEffect } from 'react';
import Spinner from './Layout/Spinner';
import Axios from 'axios';
import { Link, useParams, useHistory } from "react-router-dom";

export default function ConfirmPage(props) {
    const [msg, setMsg] = useState("");
    const [isConfirm, setIsConfirm] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);

    let redirect = null;

    const { id } = useParams();
    console.log(id);

    const history = useHistory();

    const login = () => history.push("/login");



    useEffect(() => {
        const confirmUser = async () => {
            let newId = id;
            let interval = null;
            const confirmed = await Axios.get(
                "/users/email/confirm/" + newId
            );

            setIsConfirm(true);
            redirect = setTimeout(() => {
                history.push("/login");
            }, 5000);

            setMsg(confirmed.data.msg);
            return () => clearInterval(interval);
        };
        if (!isConfirm) {
            confirmUser();
        }
        clearTimeout(redirect);
        const intervalId = setInterval(() => {

            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);

    }, [timeLeft]);




    return (
        <div>
            {isConfirm ? <div><h6>{msg}</h6>
                <p>You will be redirected to the Login page in {timeLeft}. If not redirected, please <a href="" onClick={login}>click here.</a></p></div>
                : <Spinner size='8x' spinning={'spinning'} />}
        </div>
    )
}
