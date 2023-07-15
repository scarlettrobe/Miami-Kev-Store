import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../store/product';
import './Product.css';


function ProductComponent() {
    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableProduct, setEditableProduct] = useState({ name: '', description: '', price: 0, images: [] });

    const dispatch = useDispatch();
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

    const handleSave = () => {
        setIsEditing(false);
        const updatedProduct = { ...product, ...editableProduct };
        setProduct(updatedProduct);

        // This is the new code that returns a promise
        const updateProductPromise = dispatch(updateProduct(updatedProduct));

        updateProductPromise.then(() => {
            console.log('Product updated successfully');
        })
        .catch(error => {
            console.log('Error updating product:', error);
        });
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
                    {isEditing && <button onClick={handleSave}>Save</button>}
                </div>
            )}
        </div>
    );
}

export default ProductComponent;
