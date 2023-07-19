import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProduct, removeProduct } from '../../store/product';
import './Product.css';

function ProductComponent() {
    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableProduct, setEditableProduct] = useState({ name: '', description: '', price: 0, images: [] });

    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setEditableProduct({ name: data.name, description: data.description, price: data.price, images: [] });
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleInputChange = (e, field) => {
        if (field === 'images') {
            setEditableProduct({ ...editableProduct, [field]: [...e.target.files] });
        } else {
            setEditableProduct({ ...editableProduct, [field]: e.target.value });
        }
    }

    const handleSave = async () => {
        setIsEditing(false);
        const updatedProduct = { ...product, ...editableProduct };
        setProduct(updatedProduct);

        try {
            await dispatch(updateProduct(updatedProduct));
            console.log('Product updated successfully');
        } catch (error) {
            console.log('Error updating product:', error);
        }
    }

    const handleDelete = async () => {
        try {
            await dispatch(removeProduct(product.id));
            console.log('Product deleted successfully');
            history.push('/products');  
        } catch (error) {
            console.log('Error deleting product:', error);
        }
    }

    return (
        <div>
            <h1>Product Details</h1>
            {product && (
                <div>
                    <h1 onClick={handleEdit}>
                        {isEditing
                            ? <input type="text" value={editableProduct.name} onChange={(e) => handleInputChange(e, 'name')} />
                            : product.name
                        }
                    </h1>
                    <p onClick={handleEdit}>
                        {isEditing
                            ? <textarea value={editableProduct.description} onChange={(e) => handleInputChange(e, 'description')} />
                            : product.description
                        }
                    </p>
                    <p onClick={handleEdit}>
                        Price: 
                        {isEditing
                            ? <input type="number" value={editableProduct.price} onChange={(e) => handleInputChange(e, 'price')} />
                            : product.price
                        }
                    </p>
                    <div onClick={handleEdit}>
                        {isEditing
                            ? <input type="file" multiple onChange={(e) => handleInputChange(e, 'images')} />
                            : product.images.map((image, index) => (
                                <img id='productlist' key={index} src={image.image_url} alt={`${product.name} ${index}`} />
                              ))
                        }
                    </div>
                    {isEditing ? (
                        <div>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default ProductComponent;
