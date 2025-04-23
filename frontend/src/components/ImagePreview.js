import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import placeholderImage from "../assets/placeholder-image.png";
import ImageEnlargeModal from "./ImageEnlargeModal";

const ProjectImagePreviews = ({ projectId }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  const [project, setProject] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageID, setSelectedImageID] = useState(null);

  const openModal = (imageID) => {
    setSelectedImageID(imageID);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageID(null);
  };

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
  }, [projectId]);

  return (
    <div>
      {images.length > 0 ? (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            height: "50%",
          }}
          key={images[0].id}
        >
          <img
            src={`http://127.0.0.1:8000${images[0].image}`}
            alt="Project"
            onClick={() => openModal(images.id)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            height: "50%",
            backgroundColor: "#f0f0f0",
          }}
        >
          <img
            src={placeholderImage}
            alt="Placeholder"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
            }}
          />
        </div>
      )}
      <ImageEnlargeModal
        isOpen={isModalOpen}
        imageID={selectedImageID}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProjectImagePreviews;
