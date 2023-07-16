import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createProduct } from "../../store/product";

function ProductCreate() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [product, setProduct] = useState(undefined);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productImages, setProductImages] = useState([]);

    useEffect(() => {
        const product = { name: productName, description: productDescription, price: productPrice, images: productImages };
        setProduct(product);
    }, [productName, productDescription, productPrice, productImages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const createdProduct = await dispatch(createProduct(product));
            console.log(createdProduct);
            // assuming createdProduct.id contains the id of the newly created product
            history.push(`/products/${createdProduct.id}`);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>Create a Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter a name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter a description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input
                        name="price"
                        type="number"
                        placeholder="Enter a price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="images">Images</label>
                    <input
                        name="images"
                        type="file"
                        multiple
                        onChange={(e) => setProductImages(Array.from(e.target.files))}
                    />
                </div>
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
}

export default ProductCreate;
