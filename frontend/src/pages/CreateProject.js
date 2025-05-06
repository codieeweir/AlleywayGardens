import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const CreateProject = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // This is where the geosptail data is pulled and stored from the URL generated for the project creation
  const shape = searchParams.get("geometry");
  const location = searchParams.get("location");
  let { user } = useContext(AuthContext);
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shape: shape || "",
    host: user.user_id,
    location: location,
    project_type: "",
    participants: user.user_id,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/projects/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens?.access}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const postData = await response.json();
      navigate(`/projects/${postData.id}`);
    } else {
      console.error("Failed to create project");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "75vh" }}
    >
      <div
        className="card shadow p-4 text-center mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Create Your Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Project Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Project Type:</label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option disabled value="">
                Select...
              </option>
              <option value="Alleyway Garden">Alleyway Garden</option>
              <option value="Communal Garden">Communal Garden</option>
              <option value="Personal Garden Project">
                Personal Garden Project
              </option>
            </select>
          </div>

          <textarea
            name="shape"
            value={formData.shape}
            onChange={handleChange}
            hidden
          />
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            hidden
          />

          <button type="submit" className="btn btn-success w-100 mt-3">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
