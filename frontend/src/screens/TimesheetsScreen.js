import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table, Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Endpoints } from "../constants";

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
                const { data } = await axios.get(Endpoints.GET_USER_TIMESHEET(userId), config);
                setLoading(false);
                setTimesheets(data);
            }
        },
        [userId, userInfo.token]
    );
    return (
        <Container>
            {!userInfo ? (
                <div>
                    Please <Link to={"/login?redirect=/timesheets"}>Log in</Link> to see your timesheets
                </div>
            ) : (
                <div>
                    <h1>My Timesheets</h1>
                    {loading ? (
                        <Loader />
                    ) : timesheets.length === 0 ? (
                        <Message variant="info">You dont have any timesheets yet</Message>
                    ) : (
                        <Table striped responsive className="table-sm timesheets">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Create At</th>
                                    <th>Rate</th>
                                    <th>Total Time (min)</th>
                                    <th>Total Cost</th>
                                    <th>Description</th>
                                    <th style={{ width: "0.75rem" }}></th>
                                    <th style={{ width: "0.75rem" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {timesheets.map((item) => (
                                    <tr key={item.timesheetId}>
                                        <td>
                                            <div>{item.timesheetId}</div>
                                        </td>
                                        <td>
                                            <div>{item.dateCreated}</div>
                                        </td>
                                        <td>
                                            <div>${item.rate}</div>
                                        </td>
                                        <td>
                                            <div>{item.totalTime}</div>
                                        </td>
                                        <td>
                                            <div>${item.totalTime * item.rate}</div>
                                        </td>
                                        <td>
                                            <div>{item.description}</div>
                                        </td>
                                        <td>
                                            <div>
                                                <LinkContainer to={`/timesheets/${item.timesheetId}`}>
                                                    <Button className="btn-sm">Details</Button>
                                                </LinkContainer>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Button className="btn-sm">
                                                    <i className="fas fa-trash"></i> Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan={8} align="right">
                                        <Button className="btn-sm">Add New <i className="fas fa-plus"/></Button>
                                    </th>
                                </tr>
                            </tfoot>
                        </Table>
                    )}
                </div>
            )}
        </Container>
    );
}

export default TimesheetsScreen;
