import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteOrder } from '../../store/order';

const DeleteOrder = ({ orderId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = () => {
    setLoading(true);
    setError(null);
  
    dispatch(deleteOrder(orderId))
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        setError('Error deleting order. Please try again later.');
        console.error('Error deleting order:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null); 
  };

  return (
    <>
      <button
        className="delete-button"
        onClick={handleOpenModal}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Order'}
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this order?</p>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Confirm'}
              </button>
              <button onClick={handleCloseModal} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteOrder;
