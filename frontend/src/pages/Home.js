import React, { useEffect, useState, useContext } from "react";
import Map from "../components/Map";
import { Link } from "react-router-dom";
import "./../styles/HomePage.css";
import AuthContext from "../context/AuthContext";
import Modal from "react-bootstrap/Modal";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  let { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects/")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));

    fetch("http://127.0.0.1:8000/api/zones/")
      .then((response) => response.json())
      .then((data) => setZones(data))
      .catch((error) => console.error("Error fetching Zones:", error));
  }, []);

  return (
    <>
      <div className="row g-4">
        <div
          className="col-md-4 text-center p-4 rounded shadow-sm"
          style={{ backgroundColor: "#A8D5BA" }}
        >
          <div className="d-flex flex-column align-items-center text-center h-100 justify-content-center p-3">
            {user && (
              <h5 className="text-muted mb-2">Hello, {user.firstname}!</h5>
            )}

            <h2 className="text-dark mb-3 fw-bold">
              Welcome to Alleyway Gardens
            </h2>

            <p
              className="text-dark mb-4"
              style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
            >
              Explore community projects, discover local green spaces, and
              contribute to greener neighbourhoods.
            </p>

            <p
              className="text-dark mb-4"
              style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
            >
              Ready to get started?
            </p>

            <button
              className="btn btn-success px-5 py-2 mb-2"
              style={{ fontSize: "1.1rem" }}
              onClick={() => setShowModal(true)}
            >
              View our how-to guide
            </button>
          </div>

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                Getting Started
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h2>Welcome to the Alleyway Gardens Help Guide</h2>
              <p>
                This guide walks you through using the mapping tool to
                investigate areas and create new projects in your community.
              </p>

              {/* Section 1: Area Investigation */}
              <h3>1. Investigating Areas</h3>
              <p>
                The map offers two main modes of interaction. The first is area
                investigation — helping you explore spaces that may lack green
                areas and identify opportunities for new projects.
              </p>

              <h4>Map Toggles</h4>
              <ul>
                <li>
                  <strong>Show Green Spaces:</strong> Displays all registered
                  green spaces in Northern Ireland.
                </li>
                <li>
                  <strong>Show Projects:</strong> Shows existing community-led
                  projects. Colors:
                  <ul>
                    <li>Blue - Alleyway Garden</li>
                    <li>Green - Communal Space</li>
                    <li>Red - Personal Garden Project</li>
                  </ul>
                </li>
                <li>
                  <strong>Show Your Location:</strong> Shows your location with
                  a 400m walkable radius.
                </li>
              </ul>

              <img
                src="path/to/map-toggles.gif"
                alt="Map toggles demo"
                className="img-fluid rounded my-3"
              />

              <h4>Using the Marker Tool</h4>
              <p>
                Place a marker anywhere to check how accessible green space is
                within a 400m radius.
              </p>

              <img
                src="path/to/marker-tool-demo.gif"
                alt="Using the marker tool"
                className="img-fluid rounded my-3"
              />

              <h3>2. Creating a Project</h3>
              <p>
                Use the drawing tool on the map to outline a space for your
                project.
              </p>

              <h4>Using the Drawing Tool</h4>
              <p>
                Click to drop points forming a shape. Close the shape to trigger
                the project creation prompt.
              </p>

              <img
                src="path/to/drawing-tool-demo.gif"
                alt="Using the drawing tool"
                className="img-fluid rounded my-3"
              />

              <p>
                After confirming, you'll be taken to a form to provide project
                details like name, type, and description.
              </p>

              <h4>Next Steps</h4>
              <p>
                View your project on the map, collaborate with others, and track
                progress as your garden grows.
              </p>

              <hr />
              <p className="text-muted">
                Need more help? Visit our <a href="/faq">FAQ</a> or contact us
                through the site.
              </p>
            </Modal.Body>
          </Modal>
        </div>

        <div className="col-md-8 p-0">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-0 h-100">
              <Map projects={projects} selectedZone={selectedZone} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="text-dark font-weight-bold mb-3">
                About Alleyway Gardens
              </h4>
              <p
                className="text-dark"
                style={{
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              >
                Alleyway Gardens is a platform that promotes urban greening by
                helping communities transform local spaces. We connect people
                with the environment, empowering them to create eco-friendly,
                sustainable projects.
              </p>
              <p
                className="text-dark"
                style={{
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              >
                Discover new spaces, share ideas, and work with your neighbors
                to turn overlooked areas into vibrant, green oases.
              </p>
              <p
                className="text-dark"
                style={{
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              >
                Join us in cultivating a greener, more connected future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
