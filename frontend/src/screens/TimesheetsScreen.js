import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from "react-bootstrap";
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";

function TimesheetsScreen() {
    const userId = useParams().id;
    const [timesheets, setTimesheets] = useState(() => []);
    const [loading, setLoading] = useState(() => true);
    useEffect(
        () => async () => {
            const { data } = await axios.get(`/api/timesheets/${userId}`);
            setLoading(false);
            setTimesheets(data);
        },
        [userId]
    );

    return (
        <Row>
            <Col md={8}>
                <h1>My Timesheets</h1>
                {loading ? (
                    <Loader />
                ) : timesheets.length === 0 ? (
                    <Message variant="info">
                        You dont have any timesheets yet
                    </Message>
                ) : (
                    <ListGroup variant="flush">
                        {timesheets.map((item) => (
                            <ListGroup.Item key={item.TimeSheetId}>
                                <Row>
                                    <Col md={1}>
                                        <Link to={`/timesheet/${item.TimeSheetId}`}>{item.TimeSheetId}</Link>
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
