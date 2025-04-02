import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Table, Badge } from "react-bootstrap";

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not authenticated.");

                const response = await axios.get("http://localhost:8000/api/my-orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setOrders(response.data || []);
            } catch (err) {
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-4">
                <Spinner animation="border" variant="warning" />
                <span className="ms-2">Loading orders...</span>
            </div>
        );

    if (error) return <p className="text-danger text-center fw-bold">{error}</p>;

    return (
        <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm" style={{ background: "#FAF3E0" }}>
                <thead className="text-light" style={{ background: "#6B4226" }}>
                    <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) =>
                            order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="fw-semibold">{order.id}</td>
                                    <td>{item.product?.name || <span className="text-muted">Unknown Product</span>}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="fw-bold text-success">₱{(item.product?.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                                    <td>
                                        <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </td>
                                </tr>
                            ))
                        )
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted fw-bold py-3">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

// Status badge colors
const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
        case "pending":
            return "warning";
        case "completed":
            return "success";
        case "canceled":
            return "danger";
        default:
            return "secondary";
    }
};

export default OrderTable;
