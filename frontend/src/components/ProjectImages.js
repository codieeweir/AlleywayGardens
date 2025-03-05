import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProjectImages = ({ projectId }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/project-images/${projectId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [projectId, authTokens]);

  return (
    <div>
      <h3>Project Images</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images.length > 0 ? (
          images.map((image) => (
            <img
              key={images.id}
              src={`http://127.0.0.1:8000${image.image}`}
              alt="Project"
              style={{
                width: "150px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ))
        ) : (
          <p> No Images yet for this project. </p>
        )}
      </div>
    </div>
  );
};

export default ProjectImages;
