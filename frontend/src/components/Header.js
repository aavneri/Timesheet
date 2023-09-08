import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
function Header() {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    );
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        setUserInfo(null);
        navigate("/")
    };

    useEffect(() => {
        const handleLogin = () => {
            setUserInfo(localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null);
        };
        window.addEventListener("login", handleLogin);
        return () => window.removeEventListener("login", handleLogin);
    }, []);

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>TimeSheets</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/timesheets">
                                <Nav.Link>
                                    <i className="fas fa-clock-rotate-left px-1"></i>My TimeSheets
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={`Hi, ${userInfo.name}`} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user px-1"></i>Login
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
