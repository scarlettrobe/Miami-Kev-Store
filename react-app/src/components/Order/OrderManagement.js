import React, { useEffect, useState } from 'react';
import './order.css';


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

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(response => response.json())
      .then(data => setOrders(data.orders));
      
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data.products));
  }, []);


  const openCustomerModal = (customerName) => {
    setSelectedCustomer(customerName);
  };

  const closeCustomerModal = () => {
    setSelectedCustomer(null);
  };

  const handleAddProduct = (orderId, event) => {
    const productId = event.target.value;
    addProductToOrder(orderId, productId);
  };

  const handleRemoveProduct = (orderId, event) => {
    const productId = event.target.value;
    removeProductFromOrder(orderId, productId);
  };


  const addProductToOrder = (orderId, productId) => {
    fetch(`/api/orders/${orderId}/products/${productId}`, {
      method: 'POST',
    }).then(() => {
      // Refresh the orders after a product is added.
      fetch('/api/orders')
        .then(response => response.json())
        .then(data => setOrders(data.orders));
    });
  };

  const removeProductFromOrder = (orderId, productId) => {
    fetch(`/api/orders/${orderId}/products/${productId}`, {
      method: 'DELETE',
    }).then(() => {
      // Refresh the orders after a product is removed.
      fetch('/api/orders')
        .then(response => response.json())
        .then(data => setOrders(data.orders));
    });
  };
  return (
    <div className="order-management">
      <h1>Order Management</h1>
      {selectedCustomer && (
        <CustomerInfoModal customerName={selectedCustomer} onClose={closeCustomerModal} />
      )}
      {orders.map(order => (
        <div key={order.id} className="order">
          <p>
            <a href="#" onClick={() => openCustomerModal(order.customer_name)}>Customer Name: {order.customer_name}</a>
          </p>
          <p>Total Price: {order.total_price}</p>
          <select>
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
            {order.order_items.map(item => (
              <div key={item.id}>
                <p>Product Name: {item.product_name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
          <div>
            <select onChange={(event) => handleAddProduct(order.id, event)} className="dropdown">
              <option value="">Add Product...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <select onChange={(event) => handleRemoveProduct(order.id, event)} className="dropdown">
              <option value="">Remove Product...</option>
              {order.order_items.map(item => (
                <option key={item.id} value={item.product_id}>
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
