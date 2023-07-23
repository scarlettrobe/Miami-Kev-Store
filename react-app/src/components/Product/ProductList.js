import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data.products);
        setError(null); // Clear any previous error on successful response
      })
      .catch(error => {
        setError(error.message); // Set the error state if there is an issue
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
      <h1>All Products</h1>
      <div className="product-row">
        {products.map(product => (
          <div key={product.id} className="product">
            <div className='productImages'>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].image_url}
                  alt={`${product.name} 0`}
                  onError={() => setError(`Error loading image for ${product.name}`)}
                  onLoad={() => console.log(`Image loaded successfully for ${product.name}`)}
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
            <Link to={`/products/${product.id}`}>
              <h2>{product.name}</h2>
            </Link>
            <p>${product.price}</p>
            <p className='description'>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
