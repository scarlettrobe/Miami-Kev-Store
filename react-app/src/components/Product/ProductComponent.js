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
      // Convert FileList to array and append to existing files
      const newFiles = Array.from(e.target.files);
      setEditableProduct({ ...editableProduct, [field]: [...editableProduct.images, ...newFiles] });
      setFileCount(editableProduct.images.length + newFiles.length);
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
      // Fetch the updated product details
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
            </h1>
            <p className="product-description" onClick={handleEdit}>
              {isEditing
                ? <textarea value={editableProduct.description} onChange={(e) => handleInputChange(e, 'description')} />
                : product.description
              }
            </p>
            <p className="product-price" onClick={handleEdit}>
              Price: 
              {isEditing
                ? <input type="number" value={editableProduct.price} onChange={(e) => handleInputChange(e, 'price')} />
                : product.price
              }
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
                <button className="btn-delete" onClick={handleDelete}>Delete</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

}

export default ProductComponent;
