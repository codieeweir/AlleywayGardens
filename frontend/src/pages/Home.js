import React, { useEffect, useState, useContext } from "react";
import Map from "../components/Map";
import { Link } from "react-router-dom";
import "./../styles/HomePage.css"; // Import the updated CSS file for styling
import AuthContext from "../context/AuthContext";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  let { user } = useContext(AuthContext);

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
    <div className="main-page-bg">
      <header className="map-header">
        <section>
          <Map projects={projects} selectedZone={selectedZone} />
        </section>
      </header>

      <section className="zones">
        <div className="container">
          <h3 className="text-center mb-4">
            {user && <h3> Hello {user.firstname} </h3>}
          </h3>
          <ul className="list-group list-group-horizontal-md justify-content-center">
            <li
              onClick={() => setSelectedZone("")}
              style={{ cursor: "pointer" }}
              className={`list-group-item ${
                selectedZone === "" ? "font-weight-bold" : ""
              }`}
            >
              <Link to="/" className="text-decoration-none text-dark">
                All
              </Link>
            </li>
            {zones.map((zone) => (
              <li
                key={zone.id}
                onClick={() => setSelectedZone(zone.name)}
                style={{ cursor: "pointer" }}
                className={`list-group-item ${
                  selectedZone === zone.name ? "font-weight-bold" : ""
                }`}
              >
                {zone.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="projects">
        <div className="container">
          <h2 className="text-center mb-4">Project List</h2>
          <div className="row">
            {projects.map((project) => (
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
    </div>
  );
};

export default Home;
