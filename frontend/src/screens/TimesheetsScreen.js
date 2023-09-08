import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table, Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
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
    return (
        <Container>
            {!userInfo ? (
                <Row className="py-3">
                    <Col>
                        Please <Link to={"/login?redirect=/timesheets/"}>Log in</Link> to see your timesheets
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col md={9}>
                        <h1>My Timesheets</h1>
                        {loading ? (
                            <Loader />
                        ) : timesheets.length === 0 ? (
                            <Message variant="info">You dont have any timesheets yet</Message>
                        ) : (
                            <Table striped responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Create At</th>
                                        <th>Rate</th>
                                        <th>Total Time</th>
                                        <th>Description</th>
                                        <th style={{ width: "0.75rem" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timesheets.map((item) => (
                                        <tr key={item.timesheetId}>
                                            <td>{item.timesheetId}</td>
                                            <td>{item.dateCreated}</td>
                                            <td>${item.rate}</td>
                                            <td>{item.totalTime}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                <LinkContainer to={`/timesheets/${item.timesheetId}`}>
                                                    <Button className="btn-sm">Details</Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default TimesheetsScreen;
