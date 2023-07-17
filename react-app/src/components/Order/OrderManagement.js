import React, { useEffect, useState } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    fetch('/api/orders')
      .then(response => response.json())
      .then(data => setOrders(data.orders));
  }, []);

  return (
    <div>
      <h1>Order Management</h1>
      {orders.map(order => (
        <div key={order.id}>
          <p>User ID: {order.user_id}</p>
          <p>Total Price: {order.total_price}</p>
          <p>Order Items:</p>
          {order.order_items.map(item => (
            <div key={item.id}>
              <p>Product ID: {item.product_id}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;
