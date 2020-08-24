import React from 'react';
import AuthOptions from '../auth/AuthOptions';
import { useHistory, Link } from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";

export default function Header() {

    const history = useHistory();

    const home = () => history.push("/");
    const create = () => history.push("/create");

    return (

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    <Navbar.Brand href="#" onClick={home}>URL Shortner</Navbar.Brand>
                </Nav>
                <Nav className="justify-content-end">
                    <Nav.Item onClick={home}>
                        <Nav.Link eventKey="1" as={Link} to="/home">
                            Home
            </Nav.Link>
                    </Nav.Item>
                    <Nav.Item onClick={create}>
                        <Nav.Link eventKey="2" as={Link} to="/create">
                            Create URL
            </Nav.Link>
                    </Nav.Item>
                    <AuthOptions />
                </Nav>
            </Navbar.Collapse>
        </Navbar>

    )
}
