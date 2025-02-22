import React, { useEffect, useState } from "react";
import Map from "../components/Map";
import { Link } from "react-router-dom";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects/")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch("http://127.0.0.1:8000/api/zones/")
      .then((response) => response.json())
      .then((data) => setZones(data))
      .catch((error) => console.error("Error fetching Zones :", error));
  }, []);

  return (
    <div>
      <div>
        <h1>Belfast Zones</h1>
        <ul>
          <li onClick={() => setSelectedZone("")} style={{ cursor: "pointer" }}>
            <Link to={`/`}>All</Link>
          </li>
          {zones.map((zone) => (
            <li
              key={zone.id}
              onClick={() => setSelectedZone(zone.name)}
              style={{
                cursor: "pointer",
                fontWeight: selectedZone === zone.name ? "bold" : "normal",
              }}
            >
              {zone.name}
            </li>
          ))}
        </ul>
      </div>

      <h1>Projects Map</h1>
      <Map projects={projects} selectedZone={selectedZone} />

      <div>
        <h2>Project List</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>{project.name}</Link>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
