import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const ProductCatalog = ({ products }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleShowModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleAddToCart = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You need to be logged in to add to cart.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:8000/api/cart",
                {
                    product_id: selectedProduct.id,
                    quantity: quantity,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Added to cart:", response.data);
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-5">
            <h2 className="text-2xl font-bold text-center mb-6">Product Catalog</h2>
            
            {/* Grid Layout for Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <p className="text-center text-gray-400 col-span-full">No products found.</p>
                ) : (
                    products.map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center 
                                transition transform hover:scale-105 box-border w-full min-h-[400px]"
                        >
                            {/* Product Image */}
                            <img 
                                src={product.image} 
                                className="w-48 h-48 object-cover rounded-lg mb-3" 
                                alt={product.name} 
                            />

                            {/* Product Details */}
                            <h5 className="text-lg font-bold text-gray-800">{product.name}</h5>
                            <p className="text-gray-500 flex-grow">{product.description}</p>
                            <p className="text-yellow-500 font-semibold mt-2">₱{product.price}</p>

                            {/* Stock Badge */}
                            <span className={`px-3 py-1 mt-2 rounded-full text-xs font-semibold 
                                ${product.stock > 0 ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>

                            {/* Add to Cart Button */}
                            <button 
                                className="mt-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                                onClick={() => handleShowModal(product)}
                                disabled={product.stock === 0}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Adding to Cart */}
            {selectedProduct && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img 
                            src={selectedProduct.image} 
                            className="w-full h-60 object-cover rounded-lg mb-3" 
                            alt={selectedProduct.name} 
                        />
                        <p>{selectedProduct.description}</p>
                        <p><strong>Price:</strong> ₱{selectedProduct.price}</p>
                        <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                        {error && <p className="text-danger">{error}</p>}
                        <Form>
                            <Form.Group controlId="quantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    min="1" 
                                    max={selectedProduct.stock}
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))} 
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddToCart} disabled={loading}>
                            {loading ? "Adding..." : "Add to Cart"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ProductCatalog;
