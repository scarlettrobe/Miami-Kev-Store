/* Action Types */
const SET_ORDERS = 'orders/SET_ORDERS';
const UPDATE_ORDER_STATUS = 'orders/UPDATE_ORDER_STATUS';
const ADD_PRODUCT_TO_ORDER = 'orders/ADD_PRODUCT_TO_ORDER';
const REMOVE_PRODUCT_FROM_ORDER = 'orders/REMOVE_PRODUCT_FROM_ORDER';

/* Action Creators */
export const setOrders = (orders) => {
  return {
    type: SET_ORDERS,
    payload: orders
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

export const removeProductFromOrderAction = (orderId, productId) => {
  return {
    type: REMOVE_PRODUCT_FROM_ORDER,
    payload: { orderId, productId },
  };
};

/* Thunks */
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



  

export const addProductToOrder = (orderId, productId) => async (dispatch) => {
  const response = await fetch(`/api/orders/${orderId}/products/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity: 1,
    }), // assuming quantity of 1 for new items
  });

  if (response.ok) {
    const updatedOrder = await response.json();
    dispatch(setOrders(updatedOrder));
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
    dispatch(setOrders(updatedOrder));
  } else {
    throw new Error(`Failed to remove product: ${response.status}`);
  }
};



/* Reducer */
export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ORDERS:
      return { ...state, ...action.payload.orders };
    case UPDATE_ORDER_STATUS: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          status: action.payload.status,
        },
      };
    }
    case ADD_PRODUCT_TO_ORDER: {
      const { orderId, productId } = action.payload;
      return {
        ...state,
        [orderId]: {
          ...state[orderId],
          order_items: [...state[orderId].order_items, { product_id: productId, quantity: 1 }],  // assuming quantity of 1 for new items
        },
      };
    }
    case REMOVE_PRODUCT_FROM_ORDER: {
      const { orderId, productId } = action.payload;
      return {
        ...state,
        [orderId]: {
          ...state[orderId],
          order_items: state[orderId].order_items.filter(item => item.product_id !== productId),
        },
      };
    }
    default:
      return state;
  }
}
      
