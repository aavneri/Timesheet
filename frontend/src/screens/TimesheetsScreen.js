import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import Loader from "../components/Loader";
import { Endpoints } from "../constants";
import { authRequestConfig } from "../services/RequestConfigs";
import Logout from "../common/Logout";
import Swal from "sweetalert2";

function TimesheetsScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [timesheets, setTimesheets] = useState(() => []);
    const [loading, setLoading] = useState(() => true);
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    );
    const [userId, setUserId] = useState(userInfo ? userInfo.id : -1);
    useEffect(() => {
        (async () => {
            try {
                if (userId > 0) {
                    setLoading(true);
                    const { data } = await axios.get(Endpoints.GET_USER_TIMESHEET(userId), authRequestConfig());
                    setLoading(false);
                    setTimesheets(data);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setLoading(false);
                    setUserId(-1);
                    Logout().then(() => {
                        navigate(`/login?redirect=${location.pathname}`);
                    });
                }
            }
        })();
    }, [userId]);

    const addTimesheet = () =>
        (async () => {
            try {
                Swal.fire({
                    title: "Adding...",
                    html: "Please wait a moment",
                });
                Swal.showLoading();
                const { data } = await axios.post(Endpoints.CREATE_TIMESHEET, {}, authRequestConfig());

                setTimesheets([...timesheets, data]);
                Swal.close();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Logout().then(() => {
                        navigate(`/login?redirect=${location.pathname}`);
                    });
                } else {
                    Swal.close();
                }
            }
        })();

    const deleteTimesheet = (timesheetId) =>
        (async () => {
            try {
                Swal.fire({
                    title: "Deleting...",
                    html: "Please wait a moment",
                });
                Swal.showLoading();
                const { data } = await axios.delete(Endpoints.DELETE_TIMESHEET(timesheetId), authRequestConfig());
                setTimesheets(timesheets.filter((timesheet) => timesheet.timesheetId !== timesheetId));
                Swal.close();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Logout().then(() => {
                        navigate(`/login?redirect=${location.pathname}`);
                    });
                }
                else{
                    Swal.close();
                }
            }
        })();
    return (
        <Container>
            {userId < 0 ? (
                <div className="text-center">
                    Please <Link to={"/login?redirect=/timesheets"}>Log in</Link> to see your timesheets
                </div>
            ) : (
                <div>
                    <h1>My Timesheets</h1>
                    {loading ? (
                        <Loader />
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
                                                <Button
                                                    variant="danger"
                                                    className="btn-sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteTimesheet(item.timesheetId);
                                                    }}
                                                >
                                                    Delete <i className="fas fa-trash"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan={8} align="right">
                                        <Button
                                            variant="success"
                                            className="btn-sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addTimesheet();
                                            }}
                                        >
                                            Add New <i className="fas fa-plus" />
                                        </Button>
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
