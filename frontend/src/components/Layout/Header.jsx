import React from "react";
import "../../style/Header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logo from "../../images/logoback.png";

const Header = () => {
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="80"
              height="58"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Categories</Nav.Link>
              <Nav.Link href="#link">Products</Nav.Link>
              <Nav.Link href="#link">About Us</Nav.Link>
              <Nav.Link href="#link">Review</Nav.Link>
            </Nav>
            <div className="nav-buttons">
              <Button className="transparent-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="red"
                  strokeWidth="1"
                  className="bi bi-person"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  <path
                    fillRule="evenodd"
                    d="M8 9a6 6 0 0 0-4.687 2.036C2.12 11.53 2 12.234 2 13v1h12v-1c0-.766-.12-1.47-.313-1.964A6 6 0 0 0 8 9zm-3.465 3c.27-.386.587-.728.937-1H10.53c.35.272.668.614.937 1H4.535z"
                  />
                </svg>
                Sign in
              </Button>
              <Button className="post-listing-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M8 4v8m4-4H4" />
                </svg>
                Post Listing
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
