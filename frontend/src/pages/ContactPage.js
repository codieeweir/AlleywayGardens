import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Your Email has been sent and we hope to respond within 48 hours ");
    } else {
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-md p-4 text-center mb-4"
        style={{ width: "100%", maxWidth: "700px" }}
      >
        <div>
          <h1>Contact Us</h1>
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Name </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label"> Email </label>
              <input
                type="text"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Let us know what we can help you with{" "}
              </label>
              <textarea
                type="text"
                name="message"
                className="form-control"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              Email Us
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
