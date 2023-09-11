import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Endpoints } from "../constants";
import { authRequestConfig } from "../services/RequestConfigs";
import Logout from "../common/Logout";
import axios from "axios";
import Swal from "sweetalert2";

function ProfileScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMesage] = useState("");
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateUserProfile = (user) =>
        (async () => {
            try {
                Swal.fire({
                    title: "Updating...",
                    html: "Please wait a moment",
                });
                Swal.showLoading();
                const { data } = await axios.put(Endpoints.UPDATE_PROFILE, user, authRequestConfig());
                localStorage.setItem("userInfo", JSON.stringify(data));
                setError("");
                setUserInfo(data);
                window.dispatchEvent(new Event("login"));
                Swal.close();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Logout().then(() => navigate(`/login?redirect=${location.pathname}`));
                } else {
                    Swal.close();
                    setError(error.response && error.response.data.detail ? error.response.data.detail : error.detail);
                }
            }
        })();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMesage("Passwords do not match");
        } else {
            updateUserProfile({ id: userInfo._id, name: name, email: email, password: password });
            setMesage("");
        }
    };
    return (
        <Row>
            <Col>
                <h2>User Profile</h2>
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type="name"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="passwordConfirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        Update
                    </Button>
                </Form>
            </Col>
        </Row>
    );
}

export default ProfileScreen;
