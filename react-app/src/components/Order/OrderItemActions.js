import React from 'react';
import { useDispatch } from 'react-redux';
import { addProductToOrder, removeProductFromOrder } from '../../store/order';

const OrderItemActions = ({ orderId, products, orderItems }) => {
  const dispatch = useDispatch();

  const handleAddProduct = (orderId, event) => {
    const productId = event.target.value;
    dispatch(addProductToOrder(orderId, productId));
  };

  const handleRemoveProduct = (orderId, event) => {
    const productId = event.target.value;
    dispatch(removeProductFromOrder(orderId, productId));
  };

  return (
    <div>
      <select onChange={(event) => handleAddProduct(orderId, event)} className="dropdown">
        <option value="">Add Product...</option>
        {products.map((product, index) => (
          <option key={index} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <select onChange={(event) => handleRemoveProduct(orderId, event)} className="dropdown">
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
