import React from 'react';
import OrderStatusUpdater from './OrderStatusUpdater.js';

function OrderListItem({ order }) {
    const styles = {
        orderItem: {
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
        orderHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            color: '#374151',
        },
        orderId: {
            fontWeight: '500',
        },
        orderDate: {
            fontSize: '0.9rem',
            color: '#6b7280',
        },
        orderDetails: {
            marginBottom: '0.75rem',
        },
        itemDetails: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem',
        },
        itemInfo: {
            flexGrow: 1,
        },
        itemName: {
            fontWeight: '500',
            display: 'block',
            marginBottom: '0.2rem',
        },
        orderSummary: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f0f0f0',
            color: '#374151',
        },
    };

    return (
        <div style={styles.orderItem}>
            <div style={styles.orderHeader}>
                <span style={styles.orderId}>Order ID: {order.id}</span>
                <span style={styles.orderDate}>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={styles.orderDetails}>
                {order.items && order.items.map((item) => (
                    <div key={item.productId} style={styles.itemDetails}>
                        <div style={styles.itemInfo}>
                            <span style={styles.itemName}>Product ID: {item.productId}</span>
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: ${item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div style={styles.orderSummary}>
                <span>Total: ${order.totalAmount}</span>
                <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </div>
        </div>
    );
}

export default OrderListItem;