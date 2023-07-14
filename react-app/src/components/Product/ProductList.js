import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
        setProducts(data.products); // Use "data.products" to access the products array
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>All Products</h1>
      {products.map(product => (
        <div key={product.id} className="product"> {/* Use "product.id" as the key */}
          <Link to={`/products/${product.id}`}>
            <h2>{product.name}</h2>
          </Link>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
          <div className='productImages'>
            {product.images.map((image, index) => (
              <img key={index} src={image.image_url} alt={`${product.name} ${index}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
