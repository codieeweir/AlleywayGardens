import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

// Predefined zone coordinates for filtering
const zoneCoordinates = {
  "North Belfast": { centre: [54.63, -5.93], zoom: 13 },
  "South Belfast": { centre: [54.56, -5.93], zoom: 13 },
  "East Belfast": { centre: [54.597, -5.86], zoom: 13 },
  "West Belfast": { centre: [54.597, -5.99], zoom: 13 },
};

// Default map view
const defaultView = { centre: [54.6, -5.9], zoom: 12 };

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
  const [showDrawnShapes, setShowDrawnShapes] = useState(false);

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

    // If the drawn shape is a marker (point)
    if (layerType === "marker") {
      const { lat, lng } = layer.getLatLng();
      const popupContent = `
        <h3>Located a possible project area?</h3>
        <a href="/create-project?location=${lat},${lng}">Create new project here</a>
      `;

      layer.bindPopup(popupContent).openPopup();
    }

    if (layerType === "polygon") {
      handleGeometry(layer);
    }

    setDrawnShapes([...drawnShapes, layer.toGeoJSON()]);
  };

  // If the drawn shape is a Drawn Shape (geometry)
  function handleGeometry(layer) {
    var geometry = layer.toGeoJSON().geometry;
    var geometryJson = JSON.stringify(geometry);

    var formHtml = `
      <h3>Define this area as a project's location?</h3>
      <a href="/create-project?geometry=${encodeURIComponent(geometryJson)}">
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
    <div>
      <label>
        <input
          type="checkbox"
          checked={showGreenSpaces}
          onChange={() => setShowGreenSpaces(!showGreenSpaces)}
        />
        Show Green Spaces
      </label>
      <label>
        <input
          type="checkbox"
          checked={showDrawnShapes}
          onChange={() => setShowDrawnShapes(!showDrawnShapes)}
        />
        Show Projects
      </label>

      <MapContainer
        center={defaultView.centre}
        zoom={defaultView.zoom}
        style={{ height: "400px", width: "50%" }}
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
      </MapContainer>
    </div>
  );
};

export default Map;
