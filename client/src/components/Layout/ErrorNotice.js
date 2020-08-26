import React from 'react';
import "../../App.css";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

export default function ErrorNotice(props) {
    return (
        <Col xs={8} md={6} lg={5} style={{ margin: "auto", paddingBottom: "10px" }}>
            <div className="errorNotice" onClick={props.clearError}>
                <span>{props.message}</span>
                <button onClick={props.clearError} className="errorButton"><FontAwesomeIcon icon={faTimesCircle} /></button>
            </div>
        </Col>
    )
}
