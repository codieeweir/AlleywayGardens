import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const MapController = ({ project }) => {
  const map = useMap();

  useEffect(() => {
    if (!project?.shape) return;

    try {
      const shape = JSON.parse(project.shape);
      const coordinates = shape.coordinates[0][0];
      const center = [coordinates[1], coordinates[0]];

      map.setView(center, 17);
    } catch (error) {
      console.error("Error parsing shape:", error);
    }
  }, [project, map]);

  return null;
};

const ProjectMap = ({ project }) => {
  return (
    <MapContainer
      center={[54.6, -5.9]}
      zoom={12}
      style={{ height: "400px", width: "100%%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {project?.shape && (
        <GeoJSON key={project.id} data={JSON.parse(project.shape)} />
      )}
      <MapController project={project} />
    </MapContainer>
  );
};

export default ProjectMap;
