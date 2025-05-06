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
      navigate(`/projects/${id}`);
    } else {
      console.error("Failed to update project");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "75vh" }}
    >
      <div
        className="card shadow-md p-4 text-center mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Update Your Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Project Name:</label>
            <div>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">
              Project Type:
              <div>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  className="form-control"
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
            </label>
          </div>
          <button type="submit" className="btn btn-success w-100 mt-3">
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
