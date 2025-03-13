import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "./../styles/ProjectPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [projectType, setProjectType] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects/")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const filteredProjects = projectType
    ? projects.filter((p) => p.project_type === projectType)
    : projects;

  return (
    <section className="projects">
      <div className="container">
        <h2 className="text-center mb-4">Project List</h2>
        <div className="d-flex justify-content-center gap-3 my-3">
          <button
            onClick={() => setProjectType("Alleyway Garden")}
            className={`btn ${
              projectType === "Alleyway Garden"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
          >
            Alleyway Garden
          </button>

          <button
            onClick={() => setProjectType("Communal Garden")}
            className={`btn ${
              projectType === "Communal Garden"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
          >
            Communal Garden
          </button>

          <button
            onClick={() => setProjectType("Personal Garden Project")}
            className={`btn ${
              projectType === "Personal Garden Project"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
          >
            Personal Garden Project
          </button>
          <button
            onClick={() => setProjectType("")}
            className={`btn ${
              projectType === "" ? "btn-secondary" : "btn-outline-secondary"
            }`}
          >
            Show All
          </button>
        </div>
        <div className="row">
          {filteredProjects.map((project) => (
            <div key={project.id} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src="https://via.placeholder.com/350x200"
                  className="card-img-top"
                  alt={project.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text">{project.description}</p>
                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
