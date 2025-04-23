import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Popup,
  useMap,
  Marker,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "bootstrap/dist/css/bootstrap.min.css";
import L, { marker } from "leaflet";
import { Link } from "react-router-dom";

// Predefined zone coordinates for filtering
const zoneCoordinates = {
  "North Belfast": { centre: [54.63, -5.93], zoom: 14 },
  "South Belfast": { centre: [54.56, -5.93], zoom: 14 },
  "East Belfast": { centre: [54.597, -5.86], zoom: 14 },
  "West Belfast": { centre: [54.597, -5.99], zoom: 14 },
};

// Default map view
const defaultView = { centre: [54.6, -5.9], zoom: 13 };

const markerIcons = {
  "Communal Garden": new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 36],
    shadowSize: [50, 64],
    iconAnchor: [12, 35],
    shadowAnchor: [10, 60],
    popupAnchor: [0, -40],
  }),
  "Alleyway Garden": new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",

    iconSize: [25, 35],
    shadowSize: [50, 64],
    iconAnchor: [12, 35],
    shadowAnchor: [10, 60],
    popupAnchor: [0, -40],
  }),
  "Personal Garden Project": new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 35],
    shadowSize: [50, 64],
    iconAnchor: [12, 35],
    shadowAnchor: [10, 60],
    popupAnchor: [0, -40],
  }),
};

delete L.Icon.Default.prototype._getIconURL;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Map = ({ projects, selectedZone }) => {
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [greenSpaces, setGreenSpaces] = useState(null);
  const [showGreenSpaces, setShowGreenSpaces] = useState(false);
  const [showDrawnShapes, setShowDrawnShapes] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [goToUser, setGoToUser] = useState(false);
  const [showUser, setShowUser] = useState(false);

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

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setShowUser(true);
        setGoToUser(true);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location not Available");
      }
    );
  };

  const MapUpdater = ({ selectedZone }) => {
    const map = useMap();

    useEffect(() => {
      if (goToUser && userLocation) {
        map.setView(userLocation, 15);
        setGoToUser(false);
      } else {
        return;
      }
    }, [selectedZone, userLocation, goToUser, map]);

    return null;
  };

  console.log(greenSpaces);

  const handleCreated = (e) => {
    const { layer, layerType } = e;

    if (layerType === "polygon") {
      handleGeometry(layer);
    }

    if (layerType === "marker") {
      handleMarker(layer);
    }

    setDrawnShapes([...drawnShapes, layer.toGeoJSON()]);
  };

  function handleMarker(layer) {
    var latlng = layer.getLatLng();

    var circle = L.circle(latlng, {
      radius: 400,
      color: "green",
      fillOpacity: 0.15,
    }).addTo(layer._map);

    var popupHtml = `
        <h3>Distance of 400m</h3>
        <p>This circle represents a distance of 400 meters, which is typically a 5-minute walk.</p>
        Like the look of this area? Use the draw tool to map your project area 
    `;
    layer.bindPopup(popupHtml).openPopup();

    layer.on("popupclose", function () {
      layer.remove();
      circle.remove();
      setDrawnShapes([]);
    });
  }

  function handleGeometry(layer) {
    var geometry = layer.toGeoJSON().geometry;
    var geometryJson = JSON.stringify(geometry);

    var centroid = layer.getBounds().getCenter();
    var pointJson = JSON.stringify({
      type: "Point",
      coordinates: [centroid.lng, centroid.lat],
    });

    var formHtml = `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 240px;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  ">
    <h5 style="margin-bottom: 12px; color: #333;">
      Located a possible area for your project?
    </h5>
    <a href="/create-project?geometry=${encodeURIComponent(
      geometryJson
    )}&location=${encodeURIComponent(pointJson)}"
      style="
        display: inline-block;
        padding: 8px 16px;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      "
    >
      Lets Get Started!
    </a>
  </div>
`;

    layer.bindPopup(formHtml).openPopup();

    layer.on("popupclose", function () {
      layer.remove();
      setDrawnShapes([]);
    });
  }

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
            style={{
              backgroundColor: "green",
            }}
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
            style={{
              backgroundColor: "green",
            }}
            onChange={() => setShowDrawnShapes(!showDrawnShapes)}
          />
          <label
            className="form-check-label ms-2 fw-bold"
            htmlFor="projectsCheck"
          >
            Show Projects
          </label>
        </div>
        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="locationCheck"
            checked={showUser}
            style={{
              backgroundColor: "green",
            }}
            onChange={(e) => {
              if (e.target.checked) {
                handleLocation();
              } else {
                setShowUser(false);
                setGoToUser(false);
              }
            }}
          />
          <label
            className="form-check-label ms-2 fw-bold"
            htmlFor="locationCheck"
          >
            Show Your Location
          </label>
        </div>
      </div>

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

        {showGreenSpaces && greenSpaces && (
          <GeoJSON
            data={greenSpaces}
            style={() => ({
              color: "green",
            })}
            onEachFeature={(feature, layer) => {
              const { Name, Category, PaidAccess, Type } =
                feature.properties || {};

              const title = Name || `<em>${Category || "Unnamed Area"}</em>`;
              const paid = PaidAccess ?? "Unknown";
              const type = Type ?? "Unknown";

              const popupContent = `
              <div>
              <strong> ${title} <strong> <br/>
              <p> Paid Access: ${paid} <br/>
              Type: ${type} <p>
              `;

              layer.bindPopup(popupContent);
            }}
          />
        )}

        {showDrawnShapes &&
          projects.map((project) =>
            project.shape ? (
              <GeoJSON
                key={project.id}
                data={JSON.parse(project.shape)}
                style={() => ({
                  color: "green",
                })}
              />
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
                    JSON.parse(project.location).coordinates[1],
                    JSON.parse(project.location).coordinates[0],
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

        {userLocation && showUser && (
          <>
            <Marker position={userLocation}>
              <Popup>Your Location</Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={400}
              pathOptions={{ color: "green", fillOpacity: 0.15 }}
            ></Circle>
          </>
        )}
      </MapContainer>
    </div>
  );
};
export default Map;
