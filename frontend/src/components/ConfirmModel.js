import React from "react";

const ConfirmModel = ({ isOpen, onClose, onConfirm, modelType }) => {
  if (!isOpen) return null;

  //  change based on when used, either profile deletion or project deletion
  const message =
    modelType === "User"
      ? "Are you sure you want to delete your profile? This action cannot be undone."
      : "Are you sure you want to delete this project? This action cannot be undone.";

  // ## model content and styling was ispred from this bootstrap github repo
  // https://github.com/reactjs/react-modal/blob/master/examples/bootstrap/app.js
  return (
    <div
      className="modal show fade d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModel;
