// src/Buyer/OrderCard.js
import React from 'react';

const OrderCard = ({ order }) => {
    // Function to format the date nicely
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', { // Use appropriate locale
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString; // Fallback if date is invalid
        }
    };

    // Calculate total items if not stored directly (example)
    const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <div className="order-card">
            <div className="order-card-header">
                <div>
                    <span className="order-label">Order ID:</span>
                    <span className="order-value">{order.id}</span>
                </div>
                <div>
                    <span className="order-label">Date Placed:</span>
                    <span className="order-value">{formatDate(order.orderDate)}</span>
                </div>
            </div>
            <div className="order-card-body">
                <div className="order-summary">
                     <div>
                        <span className="order-label">Total Items:</span>
                        {/* Assuming items have quantity. Adjust structure as needed */}
                        <span className="order-value">{totalItems}</span>
                    </div>
                     <div>
                        <span className="order-label">Status:</span>
                        <span className="order-value order-status">{order.status || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="order-label">Total Price:</span>
                        {/* Assuming total is stored. Adjust structure as needed */}
                        <span className="order-value order-total">${order.total ? order.total.toFixed(2) : '0.00'}</span>
                    </div>
                </div>
                {/* Optional: Display items preview */}
                {order.items && order.items.length > 0 && (
                    <div className="order-items-preview">
                        <span className="order-label">Items:</span>
                        <ul>
                            {order.items.slice(0, 3).map((item) => ( // Show first 3 items
                                <li key={item.id || item.name}> {/* Use a unique key */}
                                    {item.quantity} x {item.name}
                                </li>
                            ))}
                             {order.items.length > 3 && <li>... and more</li>}
                        </ul>
                    </div>
                )}
            </div>
             {/* Optional: Add a button for "View Details" if you implement an Order Details page */}
             {/* <button>View Details</button> */}
        </div>
    );
};

export default OrderCard;