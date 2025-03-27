import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProjectPostImages = ({ PostId, refreshTrigger }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);
  let { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/projectpost-images/${PostId}/`,
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
  }, [PostId, authTokens, refreshTrigger]);

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
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} style={{ position: "relative" }}>
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
              {user?.user_id && user.user_id === image.user && (
                <>
                  <button onClick={() => handleDelete(image.id)}>
                    Delete Image {image.id}
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p> No Images yet for this post. </p>
        )}
      </div>
    </div>
  );
};

export default ProjectPostImages;
