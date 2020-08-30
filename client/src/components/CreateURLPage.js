import React, { useState, useEffect, useContext } from 'react';
import { Form, Table, Col } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../context/UserContext";
import { useHistory } from "react-router-dom";
import ErrorNotice from './Layout/ErrorNotice';
import TableList from "./TableList";
import Loader from 'react-loader-spinner';

function CreateURLPage() {

    const [newURL, setNewURL] = useState({
        url: "",
        slug: ""
    });

    const [urls, setUrls] = useState([]);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [userName, setUserName] = useState();
    const [loading, setLoading] = useState(false);

    const { userData } = useContext(UserContext);
    const history = useHistory();
    const [notif, setNotif] = useState();


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
        setLoading(false);
    };



    const deleteList = async (id) => {
        let config = {
            headers: {
                "x-auth-token": userData.token,
            }
        };
        await Axios.delete("/url/" + id, config);
        updateList();
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setButtonLoader(true);
        setNotif(undefined);

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
            err.response.data.msg && setNotif(err.response.data.msg);
        }
        setNewURL({
            url: "",
            slug: ""
        });
        setButtonLoader(false);

    };


    useEffect(() => {
        if (!userData.token) { history.push("/login"); }
        else { updateList(); setLoading(true); }
    }, []);
    return (
        <div>
            <h1 className="heading-top">Hello, {userName}!</h1>
            {notif && <ErrorNotice message={notif} clearError={() => setNotif(undefined)} />}

            <Col xs={10} md={6} style={{ margin: "auto" }}>
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
                            placeholder="Enter your preferred slug (Optional)"
                            name="slug"
                            onChange={handleChange}
                            value={newURL.slug} />
                        <Form.Text className="text-muted">
                            Final link will be https://ur1-rd.herokuapp.com/slug
    </Form.Text>
                    </Form.Group>
                    <div><button type="submit" className="btn btn-primary">{buttonLoader ? <Loader type="ThreeDots" color="#00BFFF" height={30} width={50} /> : "Submit"}</button></div>
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
                {loading ? <div style={{
                    width: "100%",
                    height: "100",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}><Loader type="ThreeDots" color="#2BAD60" height="100" width="100" /></div>
                    : null}
            </Col>
        </div >
    )

}

export default CreateURLPage;