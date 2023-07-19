import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, changeOrderStatus, addProductToOrder, removeProductFromOrder } from '../../store/order';
import CustomerInfoModal from './CustomerInfoModal';
import './order.css';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => Object.values(state.order));
  const products = useSelector(state => Object.values(state.product));

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

  const handleAddProduct = (orderId, event) => {
    const productId = event.target.value;
    dispatch(addProductToOrder(orderId, productId));
  };
  
  const handleRemoveProduct = (orderId, event) => {
    const productId = event.target.value;
    dispatch(removeProductFromOrder(orderId, productId));
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
      <button className="create-button">Create New Order</button>
      <button className="delete-button">Delete Selected Orders</button>
      {selectedCustomer && (
        <CustomerInfoModal customerName={selectedCustomer} onClose={closeCustomerModal} />
      )}
      {orders.map(order => (
        <div key={order.id} className="order">
          <input 
            type="checkbox" 
            checked={checkedOrders[order.id] || false} 
            onChange={() => handleCheckChange(order.id)}
          />
          <p>
            <a href="#" onClick={() => openCustomerModal(order.customer_name)}>Customer Name: {order.customer_name}</a>
          </p>
          <p>Total Price: {order.total_price}</p>
          <select value={order.status} onChange={(event) => handleStatusChange(order.id, event)}>
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
          <div>
            <select onChange={(event) => handleAddProduct(order.id, event)} className="dropdown">
              <option value="">Add Product...</option>
              {products.map((product, index) => (
                <option key={index} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <select onChange={(event) => handleRemoveProduct(order.id, event)} className="dropdown">
              <option value="">Remove Product...</option>
              {order.order_items.map((item, index) => (
                <option key={index} value={item.product_id}>
                  {item.product_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;
