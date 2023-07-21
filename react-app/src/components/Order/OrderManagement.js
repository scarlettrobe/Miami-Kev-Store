import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, changeOrderStatus, deleteOrder } from '../../store/order';
import './order.css';
import OrderItemActions from './OrderItemActions';
import DeleteOrder from './DeleteOrder'; // Import the new DeleteOrder component

const OrderManagement = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => Object.values(state.order));
  const products = useSelector(state => Object.values(state.product));

useEffect(() => {
  dispatch(fetchOrders());
}, [dispatch]);


  const [selectedOrders, setSelectedOrders] = useState({});

  const handleStatusChange = (id, event) => {
    const newStatus = event.target.value;
    console.log(`Order ID: ${id}`);
    console.log(`New Status: ${newStatus}`);
    dispatch(changeOrderStatus(id, newStatus));
  };

  const handleCheckChange = (orderId) => {
    setSelectedOrders(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId]
    }));
  };

  const handleDeleteSelected = async () => {
    const selectedOrderIds = Object.keys(selectedOrders).filter((orderId) => selectedOrders[orderId]);
    console.log('Selected Order IDs:', selectedOrderIds);
    for (const orderId of selectedOrderIds) {
      await dispatch(deleteOrder(orderId));
    }
    dispatch(fetchOrders());
  };
  

  return (
    <div className="order-management">
      <h1>Order Management</h1>

      <button className="delete-button" onClick={handleDeleteSelected}>
        Delete Selected Orders
      </button>

      {orders.map(order => (
        <div key={order.id} className="order">
          <input
            type="checkbox"
            checked={selectedOrders[order.id] || false}
            onChange={() => handleCheckChange(order.id)}
          />
          <p>
            Customer Name: {order.customer_name}
          </p>
          <p>Total Price: {order.total_price}</p>
          <select
            className="status-select"
            value={order.status}
            onChange={(event) => handleStatusChange(order.id, event)}
          >
            <option value="pending_payment">Pending Payment</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <div className="order-items">
            <p>Order Items:</p>
            {order.order_items.map((item, index) => (
              <div key={index}>
                <p>Product Name: {item.product_name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
          <OrderItemActions orderId={order.id} products={products} orderItems={order.order_items} />
          <DeleteOrder orderId={order.id} />
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;
