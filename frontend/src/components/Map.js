import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Popup,
  useMap,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "bootstrap/dist/css/bootstrap.min.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import IconBlue from "../assets/Blue-Icon.png";
import IconRed from "../assets/Red-Icon.png";
import IconGreen from "../assets/Green-Icon.png";

// Predefined zone coordinates for filtering
const zoneCoordinates = {
  "North Belfast": { centre: [54.63, -5.93], zoom: 14 },
  "South Belfast": { centre: [54.56, -5.93], zoom: 14 },
  "East Belfast": { centre: [54.597, -5.86], zoom: 14 },
  "West Belfast": { centre: [54.597, -5.99], zoom: 14 },
};

// Default map view
const defaultView = { centre: [54.6, -5.9], zoom: 12 };

const markerIcons = {
  "Alleyway Garden": new L.Icon({
    iconRetinaUrl: IconBlue,
    iconUrl: IconBlue,
    iconSize: [30, 40],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  }),
  "Communal Garden": new L.Icon({
    iconRetinaUrl: IconGreen,
    iconUrl: IconGreen,

    iconSize: [30, 40],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  }),
  "Personal Garden Project": new L.Icon({
    iconRetinaUrl: IconRed,
    iconUrl: IconRed,
    iconSize: [30, 40],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  }),
};

delete L.Icon.Default.prototype._getIconURL;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to update map view based on selected zone
const MapUpdater = ({ selectedZone }) => {
  const map = useMap();

  useEffect(() => {
    if (!selectedZone || !zoneCoordinates[selectedZone]) {
      map.setView(defaultView.centre, defaultView.zoom);
    } else {
      const { centre, zoom } = zoneCoordinates[selectedZone];
      map.setView(centre, zoom);
    }
  }, [selectedZone, map]);

  return null;
};

const Map = ({ projects, selectedZone }) => {
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [greenSpaces, setGreenSpaces] = useState(null);
  const [showGreenSpaces, setShowGreenSpaces] = useState(false);
  const [showDrawnShapes, setShowDrawnShapes] = useState(true);

  // Fetch green spaces from ArcGIS API
  useEffect(() => {
    fetch(
      "https://services7.arcgis.com/rVwbcvflURVxkV6s/arcgis/rest/services/Greenspace_3_view/FeatureServer/4/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
    )
      .then((response) => response.json())
      .then((data) => setGreenSpaces(data))
      .catch((error) =>
        console.error("Error fetching greenspace data:", error)
      );
  }, []);

  // Handle new drawn features
  const handleCreated = (e) => {
    const { layer, layerType } = e;

    if (layerType === "polygon") {
      handleGeometry(layer);
    }

    setDrawnShapes([...drawnShapes, layer.toGeoJSON()]);
  };

  // If the drawn shape is a Drawn Shape (geometry)
  function handleGeometry(layer) {
    var geometry = layer.toGeoJSON().geometry;
    var geometryJson = JSON.stringify(geometry);

    var centroid = layer.getBounds().getCenter();
    var pointJson = JSON.stringify({
      type: "Point",
      coordinates: [centroid.lng, centroid.lat],
    });

    // var firstPoint = geometry.coordinates[0][0];
    // var pointJson = JSON.stringify({ firstPoint });

    var formHtml = `
      <h3>Define this area as a project's location?</h3>
      <a href="/create-project?geometry=${encodeURIComponent(
        geometryJson
      )}&location=${encodeURIComponent(pointJson)}">
        Create Project Here
      </a>
    `;

    layer.bindPopup(formHtml).openPopup();
  }

  const handleDeleted = (e) => {
    const { layers } = e;

    layers.eachLayer((layer) => {
      layer.remove();
    });
    setDrawnShapes([]);
  };

  return (
    <div className="position-relative">
      <div
        className="position-absolute bottom-0 end-0 m-3 p-3 bg-light text-dark rounded shadow"
        style={{ zIndex: 1000, padding: "10px", border: "1px solid #ccc" }}
      >
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="greenSpacesCheck"
            checked={showGreenSpaces}
            onChange={() => setShowGreenSpaces(!showGreenSpaces)}
          />
          <label
            className="form-check-label ms-2 fw-bold"
            htmlFor="greenSpacesCheck"
          >
            Show Green Spaces
          </label>
        </div>
        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="projectsCheck"
            checked={showDrawnShapes}
            onChange={() => setShowDrawnShapes(!showDrawnShapes)}
          />
          <label
            className="form-check-label ms-2 fw-bold"
            htmlFor="projectsCheck"
          >
            Show Projects
          </label>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={defaultView.centre}
        zoom={defaultView.zoom}
        style={{ height: "500px", width: "100%" }}
        className="rounded border"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater selectedZone={selectedZone} />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onDeleted={handleDeleted}
            draw={{
              rectangle: false,
              polygon: true,
              circle: false,
              marker: true,
              polyline: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>

        {showGreenSpaces && greenSpaces && <GeoJSON data={greenSpaces} />}

        {showDrawnShapes &&
          projects.map((project) =>
            project.shape ? (
              <GeoJSON key={project.id} data={JSON.parse(project.shape)} />
            ) : null
          )}

        {showDrawnShapes &&
          drawnShapes.map((shape, index) => (
            <GeoJSON key={index} data={shape} />
          ))}
        {showDrawnShapes &&
          projects.map(
            (project) =>
              project.location && (
                <Marker
                  key={`marker-${project.id}`}
                  position={[
                    JSON.parse(project.location).coordinates[1], // Latitude
                    JSON.parse(project.location).coordinates[0], // Longitude
                  ]}
                  icon={markerIcons[project.project_type]}
                >
                  <Popup>
                    <h5>{project.name}</h5>
                    <p>{project.description}</p>
                    <p>
                      Check out this project?{" "}
                      <Link to={`/projects/${project.id}`}>Click here</Link>
                    </p>
                  </Popup>
                </Marker>
              )
          )}
      </MapContainer>
    </div>
  );
};

export default Map;
