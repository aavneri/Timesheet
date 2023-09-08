import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup } from "react-bootstrap";
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";

function TimesheetsScreen() {
    const [timesheets, setTimesheets] = useState(() => []);
    const [loading, setLoading] = useState(() => true);

    const [userInfo, setUserInfo] = useState(
        localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    );
    const [userId, setUserId] = useState(userInfo ? userInfo.id : -1);
    useEffect(
        () => async () => {
            if (userId > 0) {
                setLoading(true);
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get(`/api/users/${userId}/timesheets/`, config);
                setLoading(false);
                setTimesheets(data);
            }
        },
        [userId, userInfo.token]
    );
    return !userInfo ? (
        <Row className="py-3">
            <Col>
                Please <Link to={"/login?redirect=/timesheets/"}>Log in</Link> to see your timesheets
            </Col>
        </Row>
    ) : (
        <Row>
            <Col md={8}>
                <h1>My Timesheets</h1>
                {loading ? (
                    <Loader />
                ) : timesheets.length === 0 ? (
                    <Message variant="info">You dont have any timesheets yet</Message>
                ) : (
                    <ListGroup variant="flush">
                        {timesheets.map((item) => (
                            <ListGroup.Item key={item.timesheetId}>
                                <Row>
                                    <Col md={1}>
                                        <Link to={`/timesheets/${item.timesheetId}`}>{item.timesheetId}</Link>
                                    </Col>
                                    <Col md={2}>{item.dateCreated}</Col>
                                    <Col md={8}>{item.description}</Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
        </Row>
    );
}

export default TimesheetsScreen;
