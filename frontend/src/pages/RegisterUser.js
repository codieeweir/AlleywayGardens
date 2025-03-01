import React, { useContext, useState } from "react";
//import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  //let { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json();

    if (response.ok) {
      alert(
        "Registration successful! Check you email to activate your account"
      );
      navigate("/login");
    } else {
      alert("Failed to sign up: " + JSON.stringify(responseData.error));
      console.error("Failed to sign up:", responseData);
    }
  };

  return (
    <div>
      <h1>Sign up Now!</h1>
      <form onSubmit={handleSubmit}>
        <label>First name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />

        <label>Surname</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default RegisterPage;
