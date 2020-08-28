import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import UserContext from "../../context/UserContext";
import { Nav } from "react-bootstrap";


export default function AuthOptions() {

    const { userData, setUserData } = useContext(UserContext);

    const history = useHistory();

    const register = () => history.push("/register");
    const login = () => history.push("/login");
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined,
        });
        localStorage.setItem("auth-token", "");
        localStorage.setItem("username", "");
        localStorage.setItem("id", "");
    };


    return (
        <nav>
            {
                userData.user ? (<li className="nav-item" onClick={logout}>
                    <Link to="/" className="nav-link">Log out</Link></li>) :
                    (
                        < ul className="navbar-nav ml-auto">
                            <Nav.Item onClick={login}>
                                <Nav.Link eventKey="3" as={Link} to="/login">
                                    Log In
            </Nav.Link>
                            </Nav.Item>
                            <Nav.Item onClick={register}>
                                <Nav.Link eventKey="4" as={Link} to="/register">
                                    Register
            </Nav.Link>
                            </Nav.Item>
                        </ul>
                    )
            }
        </nav>
    )
}
