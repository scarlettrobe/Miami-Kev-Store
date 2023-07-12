import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../store/product';
import './Product.css'

function ProductComponent() {
    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState({ name: false, description: false, price: false });
    const [editableProduct, setEditableProduct] = useState({ name: '', description: '', price: 0 });

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
                setEditableProduct({ name: data.name, description: data.description, price: data.price });
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const handleEdit = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
    }

    const handleInputChange = (e, field) => {
        setEditableProduct({ ...editableProduct, [field]: e.target.value });
    }

    const handleSave = async (field) => {
        setIsEditing({ ...isEditing, [field]: false });

        if (editableProduct[field] !== product[field]) {
            const updatedProduct = { ...product, [field]: editableProduct[field] };
            setProduct(updatedProduct);

            const resultAction = await dispatch(updateProduct(updatedProduct));
            if (updateProduct.fulfilled.match(resultAction)) {
                console.log("Updated successfully");
            } else {
                console.log("Failed to update");
            }
        }
    }

    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave(field);
        }
    }

    return (
        <div>
            <h1>Product Details</h1>
            {product && (
                <div>
                    <h1 onClick={() => handleEdit('name')}>
                        {isEditing.name
                            ? <input type="text" value={editableProduct.name} onChange={(e) => handleInputChange(e, 'name')} onBlur={() => handleSave('name')} onKeyDown={(e) => handleKeyDown(e, 'name')} autoFocus />
                            : product.name
                        }
                    </h1>
                    <p onClick={() => handleEdit('description')}>
                        {isEditing.description
                            ? <textarea value={editableProduct.description} onChange={(e) => handleInputChange(e, 'description')} onBlur={() => handleSave('description')} onKeyDown={(e) => handleKeyDown(e, 'description')} autoFocus />
                            : product.description
                        }
                    </p>
                    <p onClick={() => handleEdit('price')}>
                        Price: 
                        {isEditing.price
                            ? <input type="number" value={editableProduct.price} onChange={(e) => handleInputChange(e, 'price')} onBlur={() => handleSave('price')} onKeyDown={(e) => handleKeyDown(e, 'price')} autoFocus />
                            : product.price
                        }
                    </p>
                    <div className='productlist'>
                        {product.images.map((image, index) => (
                            <img id='productlist' key={index} src={image.image_url} alt={`${product.name} ${index}`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductComponent;
