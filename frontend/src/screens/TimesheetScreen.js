import React from "react";
import Table from "../components/Table";
import SheetDescription from "../components/SheetDescription";
import { Row, Col } from "react-bootstrap";

function TimesheetScreen() {
    return (
        <Row>
            <Col sm={12} md={6} lg={4} xl={3}>
                <SheetDescription title="Timesheet Description:" />
            </Col>
            <Col>
                <Table />
            </Col>
        </Row>
    );
}

export default TimesheetScreen;
