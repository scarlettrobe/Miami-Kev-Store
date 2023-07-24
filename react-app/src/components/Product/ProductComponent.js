import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProduct, removeProduct } from '../../store/product';
import './Product.css';

function ProductComponent() {
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProduct, setEditableProduct] = useState({ name: '', description: '', price: 0, images: [] });
  const [fileCount, setFileCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

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
    setErrors({}); // Reset errors when entering edit mode
  }

  const handleInputChange = (e, field) => {
    if (field === 'images') {
      const newFiles = Array.from(e.target.files);
      setEditableProduct({ ...editableProduct, [field]: [...editableProduct.images, ...newFiles] });
      setFileCount(editableProduct.images.length + newFiles.length);
    } else if (field === 'price') {
      let price = e.target.value;
      price = parseFloat(price).toFixed(2);  // This will ensure it's a number and has 2 decimal places
      setEditableProduct({ ...editableProduct, [field]: price });
    } else {
      setEditableProduct({ ...editableProduct, [field]: e.target.value });
    }
  }

  const handleSave = async () => {
    const newErrors = {};

    if (editableProduct.name.trim() === '') {
      newErrors.name = 'Product name cannot be empty.';
    }

    if (editableProduct.description.trim().length < 10) {
      newErrors.description = 'Product description should be at least 10 characters.';
    }
    
    if (editableProduct.price <= 0) {
      newErrors.price = 'Product price should be a positive number.';
    }

    const regex = /^\d+(\.\d{1,2})?$/;  // This will match numbers with up to 2 decimal places
    if (!regex.test(editableProduct.price)) {
      newErrors.price = 'Product price can have up to 2 decimal places.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsEditing(false);
    const updatedProduct = { ...product, ...editableProduct };
    setProduct(updatedProduct);

    try {
      await dispatch(updateProduct(updatedProduct));
      console.log('Product updated successfully');
      fetch(`/api/products/${id}`)
        .then(response => response.json())
        .then(data => {
          setProduct(data);
          setEditableProduct({ name: data.name, description: data.description, price: data.price, images: [] });
        });
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
    setShowDeleteModal(false);
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  }

  const showDeleteConfirmation = () => {
    setShowDeleteModal(true);
  }

  return (
    <div className="product-details">
      <h1 className="product-title">Product Details</h1>
      {product && (
        <div className="product-grid">
          <div className="product-container" id={`product-${product.id}`}>
            <h1 className="product-name" onClick={handleEdit}>
              {isEditing
                ? <input type="text" value={editableProduct.name} onChange={(e) => handleInputChange(e, 'name')} />
                : product.name
              }
              {errors.name && <p className="error-message">{errors.name}</p>}
            </h1>
            <p className="product-description" onClick={handleEdit}>
              {isEditing
                ? <textarea value={editableProduct.description} onChange={(e) => handleInputChange(e, 'description')} />
                : product.description
              }
              {errors.description && <p className="error-message">{errors.description}</p>}
            </p>
            <p className="product-price" onClick={handleEdit}>
              Price: 
              {isEditing
                ? <input type="number" value={editableProduct.price} onChange={(e) => handleInputChange(e, 'price')} />
                : product.price
              }
              {errors.price && <p className="error-message">{errors.price}</p>}
            </p>
            <div className="product-images" onClick={handleEdit}>
              {isEditing
                ? (
                  <>
                    <label htmlFor="product-images-input" className="btn-upload">
                      {fileCount === 0 ? 'Choose files' : `${fileCount} selected, add another?`}
                    </label>
                    <input type="file" id="product-images-input" multiple onChange={(e) => handleInputChange(e, 'images')} />
                  </>
                  )
                : product.images && product.images.map((image, index) => (
                  <img id={`product-image-${index}`} key={index} src={image.image_url} alt={`${product.name} ${index}`} />
                ))
              }
            </div>
            {isEditing ? (
              <div className="product-actions">
                <button className="btn-save" onClick={handleSave}>Save</button>
                <button className="btn-delete" onClick={showDeleteConfirmation}>Delete</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="delete-modal">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this product?</p>
          <button className="yesdelete" onClick={handleDelete}>Yes, Delete</button>
          <button className='cancelbuttong' onClick={handleDeleteCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ProductComponent;
