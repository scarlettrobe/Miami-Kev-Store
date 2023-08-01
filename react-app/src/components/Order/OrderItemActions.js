import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToOrder, removeProductFromOrder, fetchOrders } from '../../store/order';
import { getProducts } from '../../store/product';
import './order.css';

const OrderItemActions = ({ orderId, orderItems }) => {
  const dispatch = useDispatch();
  const products = useSelector(state => Object.values(state.product.products));

  useEffect(() => {
    dispatch(getProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleAddProduct = async (orderId, event) => {
    try {
      const productId = parseInt(event.target.value, 10); // Parse the productId as an integer
      console.log('Selected product ID:', productId);
      console.log('All products:', products);
      const product = products.find(product => product.id === productId);
  
      if (product) {
        await dispatch(addProductToOrder(orderId, productId, product.price));
        dispatch(fetchOrders());
        event.target.value = ''; // Set the value of the select element to an empty string
      } else {
        console.error(`Product with id ${productId} not found`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveProduct = async (orderId, event) => {
    const productId = parseInt(event.target.value, 10); // Parse the productId as an integer
    const product = products.find(product => product.id === productId);
    if (product) {
      try {
        await dispatch(removeProductFromOrder(orderId, productId, product.price));
        dispatch(fetchOrders());
        // Do not modify event.target.value here
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(`Product with id ${productId} not found`);
    }
  };
  

  return (
    <div>
      <select
        onChange={(event) => handleAddProduct(orderId, event)}
        className="dropdown add-product-dropdown" // Add the CSS class for styling
      >
        <option value="">Add Product...</option>
        {products.map((product, index) => (
          <option key={index} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <select
        onChange={(event) => handleRemoveProduct(orderId, event)}
        className="dropdown remove-product-dropdown" // Add the CSS class for styling
      >
        <option value="">Remove Product...</option>
        {orderItems.map((item, index) => (
          <option key={index} value={item.product_id}>
            {item.product_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderItemActions;
