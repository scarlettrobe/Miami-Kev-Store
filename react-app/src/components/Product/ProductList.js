import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);

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
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>All Products</h1>
      <div className="product-row">
        {products.map(product => (
          <div key={product.id} className="product">
            <div className='productImages'>
              {product.images && product.images.length > 0 && (
                <img src={product.images[0].image_url} alt={`${product.name} 0`} />
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

