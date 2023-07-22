import React from "react";
import "./order.css";


const CustomerInfoModal = ({customerName, onClose}) => {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>{customerName}'s Information</h2>
          {/* Here, you can add more customer information including shipping label and purchased items */}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

export default CustomerInfoModal;
  