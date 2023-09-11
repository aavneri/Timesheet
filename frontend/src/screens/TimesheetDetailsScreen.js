import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import TimeSheetData from "../components/TimeSheetData";
import Loader from "../components/Loader";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Endpoints } from "../constants";
import Logout from "../common/Logout";
import { authRequestConfig } from "../services/RequestConfigs";
import axios from "axios";

function TimesheetDetailsScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const id = useParams().id;
    const [data, setData] = useState(() => {
        return { description: "" };
    });

    const [loading, setLoading] = useState(() => true);
    const getTimesheetData = useCallback(async () => {
        try {
            const { data } = await axios.get(`${Endpoints.GET_TIMESHEET_DETAIL(id)}`, authRequestConfig());
            setData(data);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Logout().then(() => navigate(`/login?redirect=${location.pathname}`));
            }
        }
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
