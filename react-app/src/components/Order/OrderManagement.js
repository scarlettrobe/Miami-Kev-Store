import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, changeOrderStatus } from '../../store/order';
import CustomerInfoModal from './CustomerInfoModal';
import './order.css';
import OrderItemActions from './OrderItemActions';
import OrderForm from './OrderForm';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => Object.values(state.order));
  const products = useSelector(state => Object.values(state.product));
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log('Orders updated:', orders);
  }, [orders]);

  const handleStatusChange = (id, event) => {
    const newStatus = event.target.value;
    console.log(`Order ID: ${id}`);
    console.log(`New Status: ${newStatus}`);
    dispatch(changeOrderStatus(id, newStatus));
  };

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const openCustomerModal = (customerName) => {
    setSelectedCustomer(customerName);
  };

  const closeCustomerModal = () => {
    setSelectedCustomer(null);
  };

  // new state for checkboxes
  const [checkedOrders, setCheckedOrders] = useState({});

  // handle check change
  const handleCheckChange = (orderId) => {
    setCheckedOrders({ ...checkedOrders, [orderId]: !checkedOrders[orderId] });
  };

  return (
    <div className="order-management">
      <h1>Order Management</h1>
      <button className="create-button" onClick={() => setShowOrderForm(true)}>
        Create New Order
      </button>
      <button className="delete-button">Delete Selected Orders</button>
      {selectedCustomer && (
        <CustomerInfoModal customerName={selectedCustomer} onClose={closeCustomerModal} />
      )}
      {showOrderForm && <OrderForm />}
      {orders.map(order => (
        <div key={order.id} className="order">
          <input
            type="checkbox"
            checked={checkedOrders[order.id] || false}
            onChange={() => handleCheckChange(order.id)}
          />
          <p>
            <a href="#" onClick={() => openCustomerModal(order.customer_name)}>
              Customer Name: {order.customer_name}
            </a>
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
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;
