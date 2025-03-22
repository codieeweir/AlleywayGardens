import React from "react";

const ConfirmModel = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div>
      <div>
        <h3>Confirm Deletion</h3>
        <p>
          Are you sure you want to delete this project? this action cannot be
          undone{" "}
        </p>
        <div>
          <button onClick={onConfirm}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModel;
