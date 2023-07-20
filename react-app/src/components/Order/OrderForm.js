import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../store/order';
import './order.css';

const OrderForm = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => Object.values(state.product));

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const [formData, setFormData] = useState({
    user_id: '',
    order_number: '',
    order_date: '',
    status: '',
    billing_address: '',
    shipping_address: '',
    total_price: '',
    order_items: [],
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const orderItems = [...formData.order_items];
    orderItems[index][field] = value;
    setFormData({ ...formData, order_items: orderItems });
  };

  const handleAddItem = () => {
    const orderItems = [...formData.order_items, { product_id: '', quantity: '' }];
    setFormData({ ...formData, order_items: orderItems });
  };

  const handleRemoveItem = (index) => {
    const orderItems = [...formData.order_items];
    orderItems.splice(index, 1);
    setFormData({ ...formData, order_items: orderItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      user_id: selectedCustomer,
    };
    dispatch(createOrder(updatedFormData));
    // Reset form data after submission
    setFormData({
      user_id: '',
      order_number: '',
      order_date: '',
      status: '',
      billing_address: '',
      shipping_address: '',
      total_price: '',
      order_items: [],
    });
    setSelectedCustomer('');
  };

  return (
    <div className="create-order">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer:</label>
          <select
            name="user_id"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Order Number:</label>
          <input
            type="text"
            name="order_number"
            value={formData.order_number}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Order Date:</label>
          <input
            type="text"
            name="order_date"
            value={formData.order_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Billing Address:</label>
          <input
            type="text"
            name="billing_address"
            value={formData.billing_address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Shipping Address:</label>
          <input
            type="text"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Total Price:</label>
          <input
            type="text"
            name="total_price"
            value={formData.total_price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Order Items:</label>
          {formData.order_items.map((item, index) => (
            <div key={index} className="order-item">
              <select
                value={item.product_id}
                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveItem(index)}>
                Remove Item
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
