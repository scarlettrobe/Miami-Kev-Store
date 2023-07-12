import React, { useState, useEffect } from 'react';

function ProductManagement() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, { method: 'DELETE' })
      .then(() => {
        // Remove the deleted product from the state
        setProducts(products.filter(product => product.id !== id));
      });
  };

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <img src={product.image_url} alt={product.name} />
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ProductManagement;
