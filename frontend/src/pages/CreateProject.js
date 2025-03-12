import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CreateProject = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const shape = searchParams.get("geometry");
  const location = searchParams.get("location");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shape: shape || "",
    host: 2,
    location: location,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/projects/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Failed to create project");
    }
  };

  return (
    <div>
      <h1>Create a New Project</h1>
      <form onSubmit={handleSubmit}>
        <label>Project Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Shape</label>
        <textarea
          name="shape"
          value={formData.shape}
          onChange={handleChange}
          readOnly
        />

        <label>location</label>
        <textarea
          name="location"
          value={formData.location}
          onChange={handleChange}
          readOnly
        />

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
