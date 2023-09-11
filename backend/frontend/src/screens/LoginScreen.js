import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { Endpoints } from "../constants";
import { requestConfig } from "../services/RequestConfigs";
import axios from "axios";

function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const redirect = window.location.search ? window.location.search.split("=")[1] : "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const login = (email, password) =>
        (async () => {
            setLoading(true);
            try {
                const { data } = await axios.post(
                    Endpoints.LOGIN,
                    { username: email, password: password },
                    requestConfig()
                );
                localStorage.setItem("userInfo", JSON.stringify(data));
                setError("");
                setUserInfo(data);
                window.dispatchEvent(new Event("login"));
            } catch (error) {
                setError(error.response && error.response.data.detail ? error.response.data.detail : error.detail);
            }
            setLoading(false);
        })();

    const submitHandler = (e) => {
        e.preventDefault();
        login(email, password);
    };
    return (
        !userInfo && (
            <FormContainer>
                <h1>Sign In</h1>
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
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
                    <Button type="submit" variant="primary" className="my-3" disabled={!email || !password}>
                        Sign In
                    </Button>
                </Form>
                <Row className="py-3">
                    <Col>
                        New Customer?{" "}
                        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
                    </Col>
                </Row>
            </FormContainer>
        )
    );
}

export default LoginScreen;
