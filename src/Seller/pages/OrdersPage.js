import React, { useContext, useState, useEffect } from 'react';
import { SellerContext } from '../../context/SellerContext';
import { UserContext } from '../../UserContext';
import OrderListItem from '../components/OrderListItem.js';
import Loading from '../../Loading';

function OrderPage() {
    const { sellerOrders, fetchSellerOrders } = useContext(SellerContext);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            // setLoading(true);
            setError(null);
            try {
                if (user && user.role === 'Seller') {
                    await fetchSellerOrders();
                }
            } catch (err) {
                console.error("Error fetching seller orders:", err);
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user, fetchSellerOrders]);

    const styles = {
        pageContainer: {
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'system-ui, sans-serif',
        },
        pageTitle: {
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#1f2937',
        },
        orderListContainer: {
            display: 'grid',
            gap: '1rem',
        },
        message: {
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#6b7280',
            marginTop: '2rem',
        },
        error: {
            color: 'red',
            textAlign: 'center',
            marginTop: '2rem',
        },
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p style={styles.error}>{error}</p>;
    }

    if (!user || user.role !== 'Seller') {
        return <p style={styles.message}>Access denied. Please log in as a seller to view orders.</p>;
    }

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.pageTitle}>Orders</h1>
            {sellerOrders && sellerOrders.length === 0 ? (
                <p style={styles.message}>No orders received yet.</p>
            ) : (
                <div style={styles.orderListContainer}>
                    {sellerOrders && sellerOrders.map((order) => (
                        <OrderListItem key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderPage;