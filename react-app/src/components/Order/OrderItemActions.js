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
      const productId = event.target.value;
      await dispatch(addProductToOrder(orderId, productId, 1));
      dispatch(fetchOrders());
      event.target.value = ''; // Reset the dropdown value to an empty string
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveProduct = async (orderId, event) => {
    const productId = event.target.value;
    await dispatch(removeProductFromOrder(orderId, productId));
    dispatch(fetchOrders());
    event.target.value = ''; 
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
