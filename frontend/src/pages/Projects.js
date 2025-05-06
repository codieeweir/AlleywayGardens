import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./../styles/ProjectPage.css";
import ProjectImagePreviews from "../components/ImagePreview";
import { CardBody } from "react-bootstrap";
import { Container, Row, Col, Card } from "react-bootstrap";

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
      <Container className="container">
        {/* Project Type Filters */}
        <h2 className="text-center mb-4">Check Out Our Projects!</h2>
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
        <Row className="row">
          {filteredProjects.map((project) => (
            <Col key={project.id} className="col-md-4 mb-4">
              <Card className="w-100 h-100 shadow-sm d-flex flex-column">
                <div
                  className="card-img-top"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <ProjectImagePreviews projectId={project.id} />
                </div>
                <CardBody className="card-body">
                  <strong className="project-title">{project.name}</strong>
                  <p className="card-text">{project.description}</p>
                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ProjectsPage;
