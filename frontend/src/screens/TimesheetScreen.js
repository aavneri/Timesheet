import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import TimeSheetData from "../components/TimeSheetData";
import Loader from '../components/Loader'
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

function TimesheetScreen() {
    const id = useParams().id;
    const [data, setData] = useState(() => {
        return { description: "" };
    });
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    );
    const [loading, setLoading] = useState(() => true);
    useEffect(
        () => async () => {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get(`/api/timesheets/${id}/`, config);
            setData(data);
            setLoading(false);
        },
        [id, userInfo.token]
    );

    return (
        <Container className="">
            <h1>{`Timesheet ${id}`}</h1>
            {loading ? (
                <Loader />
            ) : (
                <Row>
                    <Col sm={12} md={6} lg={4} xl={3}>
                        <TimeSheetData data={data} />
                    </Col>
                    <Col>
                        <Table tabelData={data.lineItems} />
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default TimesheetScreen;
