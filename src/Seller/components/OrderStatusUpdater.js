import React, { useState, useContext } from 'react';
import { SellerContext } from '../../context/SellerContext';

function OrderStatusUpdater({ orderId, currentStatus }) {
    const { updateOrderStatus } = useContext(SellerContext);
    const [status, setStatus] = useState(currentStatus);

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleUpdateStatus = () => {
        updateOrderStatus(orderId, status);
        // Optionally provide visual feedback (e.g., a message)
    };

    const styles = {
        statusUpdater: {
            display: 'flex',
            alignItems: 'center',
        },
        statusLabel: {
            marginRight: '0.5rem',
            fontSize: '0.9rem',
            color: '#4b5563',
        },
        statusSelect: {
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
            fontSize: '0.9rem',
            marginRight: '0.75rem',
        },
        updateButton: {
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s ease-in-out',
        },
        updateButtonHover: {
            backgroundColor: '#4338ca',
        },
    };

    return (
        <div style={styles.statusUpdater}>
            <label htmlFor={`status-${orderId}`} style={styles.statusLabel}>Status:</label>
            <select
                id={`status-${orderId}`}
                value={status}
                onChange={handleStatusChange}
                style={styles.statusSelect}
            >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={handleUpdateStatus} style={styles.updateButton}>Update</button>
        </div>
    );
}

export default OrderStatusUpdater;