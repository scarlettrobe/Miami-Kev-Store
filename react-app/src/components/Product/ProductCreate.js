import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createProduct } from "../../store/product";
import "./ProductCreate.css";

function ProductCreate() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [product, setProduct] = useState(undefined);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productImages, setProductImages] = useState([]);

    const [errors, setErrors] = useState([]);

    const ALLOWED_EXTENSIONS = new Set(["pdf", "png", "jpg", "jpeg", "gif"]);

    const checkExtension = (file) => ALLOWED_EXTENSIONS.has(file.name.split('.').pop().toLowerCase());

    useEffect(() => {
        const product = { name: productName, description: productDescription, price: productPrice, images: productImages };
        setProduct(product);
    }, [productName, productDescription, productPrice, productImages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];

        // Perform validation
        if (!productName.trim()) errors.push("Product name can't be empty");
        if (productName.length > 50) errors.push("Product name must not exceed 50 characters");

        if (!productDescription.trim()) errors.push("Product description can't be empty");
        if (productDescription.length < 10) errors.push("Product description must be at least 10 characters long");
        if (productDescription.length > 500) errors.push("Product description must not exceed 500 characters");

        if (productPrice < 0) errors.push("Price can't be negative");
        if (productPrice > 100000) errors.push("Price cannot exceed 100,000");
        if (isNaN(productPrice) || !/^\d+(\.\d{0,2})?$/.test(productPrice.toString())) {
            errors.push("Invalid price format. Please enter a valid price.");
        }
    

        if (productImages.some(file => !checkExtension(file))) errors.push("Images must be of type: pdf, png, jpg, jpeg, or gif");
        if (productImages.length > 5) errors.push("Cannot upload more than 5 images");
        if (productImages.some(file => file.size > 2000000)) errors.push("Image file size must not exceed 2MB");

        // Additional image validation: Check if an image is added
        if (productImages.length === 0) {
            errors.push("Please add at least one image.");
        }

        setErrors(errors);
        if (!errors.length) {
            try {
                const createdProduct = await dispatch(createProduct(product));
                console.log(createdProduct);
                // assuming createdProduct.id contains the id of the newly created product
                history.push(`/products/${createdProduct.id}`);
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="product-create-container">
            <h1 id="product-create-title">Create a Product</h1>
            {errors && errors.map((error, idx) => <p key={idx} className="error-message">{error}</p>)}
            <form onSubmit={handleSubmit} className="product-create-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter a name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter a description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        name="price"
                        type="number"
                        placeholder="Enter a price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="images">Images</label>
                    <input
                        name="images"
                        type="file"
                        multiple
                        onChange={(e) => setProductImages(Array.from(e.target.files))}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="create-product-button">Create Product</button>
            </form>
        </div>
    );

}

export default ProductCreate;
