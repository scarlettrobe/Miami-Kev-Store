import React, { useEffect, useState } from 'react';

function ProductComponent() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.products) {
                    setProducts(data.products)
                } else {
                    throw new Error('Invalid data structure');
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const viewProduct = (id) => {
        fetch(`/api/products/${id}`)
            .then(response => response.json())
            .then(data => setSelectedProduct(data));
    };

    return (
        <div>
            <h1>Products</h1>
            <div className="row">
                <div className="col-md-4">
                    <ul className="list-group">
                        {products.map(product => (
                            <li className="list-group-item" key={product.id}>
                                <button className="btn btn-link" onClick={() => viewProduct(product.id)}>{product.name}</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-8">
                    {selectedProduct && (
                        <div>
                            <h1>{selectedProduct.name}</h1>
                            <p>{selectedProduct.description}</p>
                            <p>Price: {selectedProduct.price}</p>
                            <img src={selectedProduct.image_url} alt={selectedProduct.name} />

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductComponent;
