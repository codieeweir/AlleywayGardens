import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditProject = () => {
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/projects/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setProject(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          project_type: data.project_type || "",
        });
      })
      .catch((error) => console.error("Error fetching projects :", error));
  }, [id]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_type: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://127.0.0.1:8000/api/projects/update/${id}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Failed to update project");
    }
  };

  return (
    <div>
      <h1>Update Your Project</h1>
      <form onSubmit={handleSubmit}>
        <label>Project Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Project Type:
          <select
            name="project_type"
            value={formData.project_type}
            onChange={handleChange}
          >
            <option disabled value=""></option>
            <option value="Alleyway Garden">Alleyway Garden</option>
            <option value="Communal Garden">Communal Garden</option>
            <option value="Personal Garden Project">
              Personal Garden Project
            </option>
          </select>
        </label>
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
};

export default EditProject;
