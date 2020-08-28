import React, { useState, useEffect, useContext } from 'react';
import { Form, Table, Col } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../context/UserContext";
import { useHistory } from "react-router-dom";
import ErrorNotice from './Layout/ErrorNotice';
import TableList from "./TableList";

function CreateURLPage() {

    const [newURL, setNewURL] = useState({
        url: "",
        slug: ""
    });

    const [urls, setUrls] = useState([]);
    const [userName, setUserName] = useState();

    const { userData } = useContext(UserContext);
    const history = useHistory();
    const [error, setError] = useState();


    function handleChange(event) {
        const value = event.target.value;
        setNewURL({
            ...newURL,
            [event.target.name]: value
        });
    }



    const updateList = async () => {
        let config = {
            headers: {
                "x-auth-token": userData.token,
            }
        };
        const receivedUrls = await Axios.get(
            '/url/all',
            config
        );
        const receivedData = await receivedUrls.data;
        setUrls(receivedData);
        setUserName(localStorage.getItem("username"));
    };



    const deleteList = async (id) => {
        let config = {
            headers: {
                "x-auth-token": userData.token,
            }
        };
        const deletedUrl = await Axios.delete("/url/" + id, config);
        updateList();
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {

            const newUrlEntry = {
                url: newURL.url,
                slug: newURL.slug
            };

            let config = {
                headers: {
                    "x-auth-token": userData.token,
                }
            };

            await Axios.post(
                '/url/add',
                newUrlEntry,
                config);

            updateList();

        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
        setNewURL({
            url: "",
            slug: ""
        });

    };


    useEffect(() => {
        if (!userData.token) { history.push("/login"); }
        else { updateList(); }
    }, []);
    return (
        <div>
            <h1 className="heading-top">Hello, {userName}!</h1>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}

            <Col xs={8} md={6} style={{ margin: "auto" }}>
                <Form onSubmit={onSubmit} style={{ paddingBottom: "30px" }}>
                    <Form.Group controlId="formBasicURL">
                        <Form.Label>URL</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="https://website-url.com"
                            name="url"
                            onChange={handleChange}
                            value={newURL.url} />
                    </Form.Group>

                    <Form.Group controlId="formBasicSlug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your preferred slug"
                            name="slug"
                            onChange={handleChange}
                            value={newURL.slug} />
                        <Form.Text className="text-muted">
                            Final link will be https://ur1-s.herokuapp.com/slug
    </Form.Text>
                    </Form.Group>
                    <input type="submit" value="Submit" className="btn btn-primary" />
                </Form>
            </Col>

            <Col lg={11} md={11} xs={12} style={{ padding: "10px 5px", margin: "auto" }}>
                <Table striped bordered hover variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>URL</th>
                            <th>Slug</th>
                            <th>Clicks</th>
                            <th>Copy</th>
                            <th>Link</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.map((item, index) => {
                            return (
                                <TableList
                                    key={item._id}
                                    id={item._id}
                                    index={index}
                                    url={item.url}
                                    slug={item.slug}
                                    views={item.views}
                                    updateList={updateList}
                                    deleteList={deleteList}
                                />
                            );
                        })}
                    </tbody>

                </Table>
            </Col>
        </div>
    )

}

export default CreateURLPage;