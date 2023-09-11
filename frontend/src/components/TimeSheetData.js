import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, InputGroup } from "react-bootstrap";
import debounce from "lodash.debounce";
import { Endpoints } from "../constants";
import Logout from '../common/Logout'
import { authRequestConfig } from "../services/RequestConfigs";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

function TimeSheetData({ timesheetData }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState(timesheetData);
    const updateTimeSheetData = useCallback(
        (data) =>
            (async () => {
                try {
                    const { response } = await axios.put(
                        `${Endpoints.UPDATE_TIMESHEET(data.timesheetId)}`,
                        { rate: data.rate, description: data.description },
                        authRequestConfig()
                    );
                    Toast.fire({
                        icon: "success",
                        title: "Timesheet Updated",
                    });
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        Logout().then(() => {
                            navigate(`/login?redirect=${location.pathname}`);
                        });
                    }
                }
            })(),
        []
    );
    const debouncedUpdateTimeSheetData = useMemo(() => debounce(updateTimeSheetData, 300), [updateTimeSheetData]);
    useEffect(() => {
        setData(timesheetData);
        return () => {
            debouncedUpdateTimeSheetData.cancel();
        };
    }, [timesheetData, debouncedUpdateTimeSheetData]);
    return (
        <Form>
            <Form.Group className="mb-3" controlId="textArea">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={data.description ?? ""}
                    onChange={(e) => {
                        const newData = { ...data, description: e.target.value };
                        setData(newData);
                        debouncedUpdateTimeSheetData(newData);
                    }}
                />
            </Form.Group>
            <Form.Label>Rate:</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                    aria-label="Rate (to the nearest dollar)"
                    type="number"
                    value={data.rate}
                    onChange={(e) => {
                        const newData = { ...data, rate: e.target.value };
                        setData(newData);
                        debouncedUpdateTimeSheetData(newData);
                    }}
                    min={0}
                    max={10000}
                />
                <InputGroup.Text>.00</InputGroup.Text>
            </InputGroup>
            <Form.Group className="mb-3" controlId="totalHours">
                <Form.Label>Total Hours:</Form.Label>
                <Form.Control type="number" value={data.totalTime} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="totalHours">
                <Form.Label>Total Cost:</Form.Label>
                <Form.Control type="number" value={data.totalTime * data.rate} readOnly />
            </Form.Group>
        </Form>
    );
}

export default TimeSheetData;
