import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProjectImages = ({ projectId, refreshTrigger }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  const [project, setProject] = useState();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/project-images/${projectId}/`,
          {
            headers: {},
          }
        );
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [projectId, authTokens, refreshTrigger]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/projects/${projectId}/`)
      .then((response) => response.json())
      .then((data) => setProject(data))
      .catch((error) => console.error("Error fetching projects :", error));
  }, [projectId]);

  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this post")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete-image/${imageId}/`,
        {
          method: "DELETE",
          headers: {},
        }
      );

      if (response.ok) {
        setImages(images.filter((image) => image.id != imageId));
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error delete image", error);
    }
  };

  return (
    <div>
      <h3>Project Images</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images.length > 0 ? (
          images.map((image) => (
            <div>
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
              {(user?.user_id === image.user ||
                user?.user_id === project?.host) && (
                <>
                  <button onClick={() => handleDelete(image.id)}>
                    Delete Image {image.id}
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p> No Images yet for this project. </p>
        )}
      </div>
    </div>
  );
};

export default ProjectImages;
