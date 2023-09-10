import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import TimeSheetData from "../components/TimeSheetData";
import Loader from "../components/Loader";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Endpoints } from "../constants";
import { authRequestConfig } from "../services/RequestConfigs";
import axios from "axios";

function TimesheetDetailsScreen() {
    const id = useParams().id;
    const [data, setData] = useState(() => {
        return { description: "" };
    });
    // const [userInfo, setUserInfo] = useState(
    //     localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    // );
    const [loading, setLoading] = useState(() => true);
    const getTimesheetData = useCallback(async () => {
        const { data } = await axios.get(`${Endpoints.GET_TIMESHEET_DETAIL(id)}`, authRequestConfig());
        setData(data);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        getTimesheetData();
    }, [id, getTimesheetData]);

    useEffect(() => {
        window.addEventListener("lineItemUpdated", getTimesheetData);
        return () => window.removeEventListener("lineItemUpdated", getTimesheetData);
    }, [getTimesheetData]);

    return (
        <Container className="">
            <h1>{`Timesheet ${id}`}</h1>
            {loading ? (
                <Loader />
            ) : (
                <Row>
                    <Col sm={12} md={6} lg={4} xl={3}>
                        <TimeSheetData timesheetData={data} />
                    </Col>
                    <Col>
                        <Table tabelData={data.lineItems} sheetId={id} />
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default TimesheetDetailsScreen;
