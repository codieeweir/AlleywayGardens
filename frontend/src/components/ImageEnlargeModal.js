import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

const ImageEnlargeModal = ({ imageID, isOpen, onClose }) => {
  const [image, setImage] = useState(null);

  // Model used to enlarge images

  useEffect(() => {
    if (isOpen && imageID) {
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/images/${imageID}/`,
            {
              headers: {},
            }
          );
          const data = await response.json();
          setImage(data);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };
      fetchImage();
    }
  }, [imageID, isOpen]);

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      size="md"
      aria-labelledby="imageModalLabel"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {image ? (
          <img src={image.image} alt="Enlarged" className="img-fluid" />
        ) : (
          <p>Loading...</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageEnlargeModal;
