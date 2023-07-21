/* Action Types */
const FETCH_PRODUCT = 'products/FetchProduct';
const FETCH_PRODUCTS = 'products/FetchProducts';
const MAKE_PRODUCT = 'products/MakeProduct';
const EDIT_PRODUCT = 'products/EditProduct';
const DELETE_PRODUCT = 'products/DeleteProduct';

const initialState = {
    products: {},
};

/* Action Creators */
export const fetchProduct = (product) => {
    return {
        type: FETCH_PRODUCT,
        payload: product,
    };
};

export const fetchProducts = (products) => {
    return {
        type: FETCH_PRODUCTS,
        payload: products,
    };
};

export const makeProduct = (product) => {
    return {
        type: MAKE_PRODUCT,
        payload: product,
    };
};

export const editProduct = (product) => {
    return {
        type: EDIT_PRODUCT,
        payload: product,
    };
};

export const deleteProduct = (id) => {
    return {
        type: DELETE_PRODUCT,
        payload: id,
    };
};

/* Thunks */
export const getProduct = (id) => async (dispatch) => {
    const response = await fetch(`/api/products/${id}`);
    if (response.ok) {
        const product = await response.json();
        dispatch(fetchProduct(product));
        return product;
    }
};

/* Thunks */
export const getProducts = () => async (dispatch) => {
    const response = await fetch(`/api/products`);
    if (response.ok) {
        const data = await response.json();
        const products = data.products;  // extract products from data
        dispatch(fetchProducts(products));
        return products;
    }
};


export const createProduct = (product) => async (dispatch) => {
    const { images, ...otherProductDetails } = product;

    const formData = new FormData();
    Object.entries(otherProductDetails).forEach(([key, value]) => {
        formData.append(key, value);
    });

    // Append 'images' as an array
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const newProduct = await response.json();
        dispatch(makeProduct(newProduct));
        return newProduct;
    }
};


export const updateProduct = (product) => async (dispatch) => {
    const { images, ...otherProductDetails } = product;

    const formData = new FormData();
    Object.entries(otherProductDetails).forEach(([key, value]) => {
        formData.append(key, value);
    });

    // Append 'images' as an array
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        body: formData,
    });

    if (response.ok) {
        const updatedProduct = await response.json();
        dispatch(editProduct(updatedProduct));
        return updatedProduct;
    } else {
        throw new Error(`Update failed: ${response.status}`);
    }
};

export const removeProduct = (id) => async (dispatch) => {
    const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteProduct(id));
        return id;
    } else {
        throw new Error(`Failed to delete product: ${response.status}`);
    }
};

/* Reducer */
export default function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case FETCH_PRODUCT:
            newState = Object.assign({}, state);
            newState.products[action.payload.id] = action.payload;
            return newState;
        case FETCH_PRODUCTS:
            newState = Object.assign({}, state);
            newState.products = action.payload.reduce((acc, product) => {
                acc[product.id] = product;
                return acc;
            }, {});
            return newState;
        case MAKE_PRODUCT:
            newState = Object.assign({}, state);
            newState.products[action.payload.id] = action.payload;
            return newState;
        case EDIT_PRODUCT:
            newState = Object.assign({}, state);
            newState.products[action.payload.id] = action.payload;
            return newState;
        case DELETE_PRODUCT:
            newState = Object.assign({}, state);
            delete newState.products[action.payload];
            return newState;
        default:
            return state;
    }
}
