import React from "react";
import "../style/Landing.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
const Landing = () => {
  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="content">
          <h1>
            Elevate Your Living Space with{" "}
            <span className="red-span">Upskar Rentals</span>
          </h1>
          <h2>Easy, Stylish, and Affordable Furniture Rentals</h2>

          <InputGroup className="mb-3">
            <Form.Control aria-label="search" placeholder="Search for" />
            <Form.Control
              as="select"
              aria-label="location"
              className="location-input"
            >
              <option>Location</option>
              <option value="1">New York</option>
              <option value="2">Los Angeles</option>
              <option value="3">Chicago</option>
              <option value="4">Houston</option>
              <option value="5">Philadelphia</option>
            </Form.Control>
            <Button variant="light" className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 10.5l3.5 3.5"></path>
                <circle cx="6.5" cy="6.5" r="5.75"></circle>
              </svg>
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Landing;
