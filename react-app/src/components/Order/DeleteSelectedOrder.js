import React from 'react';
import './DeleteSelectedOrder.css';

function DeleteSelectModal({ confirmDelete, closeModal }) {
  return (
    <div className="delete-modal-background" onClick={closeModal}>
        <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete these orders?</p>
            <div className="modal-buttons">
                <button onClick={confirmDelete}>Confirm</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </div>
    </div>
    );
}

export default DeleteSelectModal;
