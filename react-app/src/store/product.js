/* Action Types */
const FETCH_PRODUCT = 'products/FetchProduct'
const MAKE_PRODUCT = 'products/MakeProduct'
const EDIT_PRODUCT = 'products/EditProduct'
const DELETE_PRODUCT = 'products/DeleteProduct'

const initialState = {
    products: {},
}

/* Action Creators */

export const fetchProduct = (product) => {
    return {
        type: FETCH_PRODUCT,
        payload: product
    }
}

export const makeProduct = (product) => {
    return {
        type: MAKE_PRODUCT,
        payload: product
    }
}

export const editProduct = (product) => {
    return {
        type: EDIT_PRODUCT,
        payload: product
    }
}

export const deleteProduct = (id) => {
    return {
        type: DELETE_PRODUCT,
        payload: id
    }
}

/* Thunks */

export const getProduct = (id) => async (dispatch) => {
    const response = await fetch(`/api/products/${id}`)
    if (response.ok) {
        const product = await response.json()
        dispatch(fetchProduct(product))
        return product
    }
}

export const createProduct = (product) => async (dispatch) => {
    const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images 
        })
    });
    if (response.ok) {
        const newProduct = await response.json();
        dispatch(makeProduct(newProduct));
        return newProduct;
    }
}


export const updateProduct = (product) => async (dispatch) => {
    const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images 
        })
    });
    if (response.ok) {
        const updatedProduct = await response.json();
        dispatch(editProduct(updatedProduct));
        return updatedProduct;
    }
}

export const removeProduct = (id) => async (dispatch) => {
    const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        const deletedProduct = await response.json()
        dispatch(deleteProduct(id))
        return deletedProduct
    }
}

/* Reducer */

export default function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case FETCH_PRODUCT:
            newState = Object.assign({}, state)
            newState.products[action.payload.id] = action.payload
            return newState
        case MAKE_PRODUCT:
            newState = Object.assign({}, state)
            newState.products[action.payload.id] = action.payload
            return newState
        case EDIT_PRODUCT:
            newState = Object.assign({}, state)
            newState.products[action.payload.id] = action.payload
            return newState
        case DELETE_PRODUCT:
            newState = Object.assign({}, state)
            delete newState.products[action.payload]
            return newState
        default:
            return state
    }
}
