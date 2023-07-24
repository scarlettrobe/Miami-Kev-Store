/* Action Types */
const SET_ORDERS = 'orders/SET_ORDERS';
const UPDATE_ORDER_STATUS = 'orders/UPDATE_ORDER_STATUS';
const ADD_PRODUCT_TO_ORDER = 'orders/ADD_PRODUCT_TO_ORDER';
const REMOVE_PRODUCT_FROM_ORDER = 'orders/REMOVE_PRODUCT_FROM_ORDER';
const MAKE_ORDER = 'orders/MAKE_ORDER';
const DELETE_ORDER = 'orders/DELETE_ORDER';

/* Action Creators */
export const setOrders = (orders) => {
  return {
    type: SET_ORDERS,
    payload: orders
  };
};

export const makeOrder = (order) => {
  return {
    type: MAKE_ORDER,
    payload: order
  };
};

export const updateOrderStatus = (id, status) => {
  return {
    type: UPDATE_ORDER_STATUS,
    payload: { id, status },
  };
};

export const addProductToOrderAction = (orderId, productId) => {
  return {
    type: ADD_PRODUCT_TO_ORDER,
    payload: { orderId, productId, quantity: 1 },
  };
};

export const removeProductFromOrderAction = (orderId, productId, price) => {
  return {
    type: REMOVE_PRODUCT_FROM_ORDER,
    payload: { orderId, productId, price },
  };
};


export const deleteOrderAction = (id) => {
  return {
    type: DELETE_ORDER,
    payload: id,
  };
};

/* Thunk */
export const deleteOrder = (orderId) => async (dispatch) => {
  try {
    // First, delete associated order items
    await deleteOrderItems(orderId);
    // Then, delete the order
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteOrderAction(orderId));
    } else {
      throw new Error(`Failed to delete order: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

const deleteOrderItems = async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}/products`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete order items: ${response.status}`);
  }
};

export const fetchOrders = () => async (dispatch) => {
  const response = await fetch('/api/orders');
  if (response.ok) {
    const orders = await response.json();
    dispatch(setOrders(orders));
    return orders;
  }
};

export const changeOrderStatus = (id, status) => async (dispatch) => {
  console.log(`Inside action creator: Order ID: ${id}, Order:`, status);
  
  const response = await fetch(`/api/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({status}),
  });

  // Handle the response and dispatch appropriate actions
  if (response.ok) {
    const updatedOrder = await response.json();
    dispatch(updateOrderStatus(id, updatedOrder.status));    
  } else {
    // Dispatch error action or handle the error
  }
};

export const createOrder = (order) => async (dispatch) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (response.ok) {  
    const newOrder = await response.json();
    dispatch(makeOrder(newOrder));
    return newOrder;
  } else {
    // Dispatch error action or handle the error
    throw new Error(`Failed to create order: ${response.status}`);
  }
};


export const addProductToOrder = (orderId, productId, price) => async (dispatch) => {
  const response = await fetch(`/api/orders/${orderId}/products/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity: 1,
      price,
    }), // assuming quantity of 1 for new items
  });

  if (response.ok) {
    const updatedOrder = await response.json();
    dispatch(setOrders({ orders: [updatedOrder] }));
  } else {
    throw new Error(`Failed to add product: ${response.status}`);
  }
};  

export const removeProductFromOrder = (orderId, productId) => async (dispatch) => {
  const response = await fetch(`/api/orders/${orderId}/products/${productId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    const updatedOrder = await response.json();
    dispatch(setOrders({ orders: [updatedOrder] }));
  } else {
    throw new Error(`Failed to remove product: ${response.status}`);
  }
};



/* Reducer */
export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ORDERS:
      const ordersObject = action.payload.orders.reduce((obj, order) => {
        obj[order.id] = order;
        return obj;
      }, {});
      return ordersObject;

    case UPDATE_ORDER_STATUS:

      if (state[action.payload.id]) {
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            status: action.payload.status,
          },
        };
      }
      return state;

    case ADD_PRODUCT_TO_ORDER: {
      const { orderId, productId } = action.payload;
      if (state[orderId]) {
        return {
          ...state,
          [orderId]: {
            ...state[orderId],
            order_items: [...state[orderId].order_items, { product_id: productId, quantity: 1 }],
          },
        };
      }
      return state;
    }

    case REMOVE_PRODUCT_FROM_ORDER: {
      const { orderId, productId, price } = action.payload;
      if (state[orderId]) {
        // Calculate the quantity of this product in the order
        const productInOrder = state[orderId].order_items.find(item => item.product_id === productId);
        const quantity = productInOrder ? productInOrder.quantity : 0;
    
        return {
          ...state,
          [orderId]: {
            ...state[orderId],
            total_price: state[orderId].total_price - price * quantity, // Update the total price
            order_items: state[orderId].order_items.filter(item => item.product_id !== productId),
          },
        };
      }
      return state;
    }

    case DELETE_ORDER: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }

    case MAKE_ORDER: {
      return { ...state, [action.payload.id]: action.payload };
    }

    default:
      return state;
  }
}
