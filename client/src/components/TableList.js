import React from 'react';
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TableList(props) {

    return (
        <tr>
            <td>{props.index + 1}</td>
            <td>{props.url}</td>
            <td>{props.slug}</td>
            <td>{props.views}</td>
            <td onClick={props.updateList}><a href={"https://ur1-s.herokuapp.com/" + props.slug} rel="noopener noreferrer" target="_blank"><FontAwesomeIcon icon={faExternalLinkAlt} /></a></td>
            <td onClick={() => { props.deleteList(props.id) }}><a href="#"><FontAwesomeIcon icon={faTrashAlt} /></a></td>
        </tr>
    )
}
