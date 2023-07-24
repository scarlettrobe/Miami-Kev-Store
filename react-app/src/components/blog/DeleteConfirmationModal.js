import React from 'react';

function DeleteConfirmationModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this blog post?</p>
        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-button confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
