// src/pages/SellerOrdersPage.jsx

import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../firebase";
import { UserContext } from "../../context/UserContext";

export default function SellerOrdersPage() {
  const { user } = useContext(UserContext);
  const [orders, setOrders]             = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  // subscribe to this seller's orders
  useEffect(() => {
    if (!user || user.role !== "Seller") return;
    const q = query(
      collection(db, "orders"),
      where("sellerId", "==", user.uid)
    );
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  // whenever orders change, fetch each group's unique items
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const details = [];
      for (const ord of orders) {
        // dedupe
        const uniqueIds = Array.from(new Set(ord.items || []));
        // fetch first product to display
        let firstProduct = null;
        if (uniqueIds.length) {
          const q = query(
            collection(db, "items"),
            where("id", "==", uniqueIds[0])
          );
          const snap = await getDocs(q);
          if (!snap.empty) firstProduct = { id: snap.docs[0].id, ...snap.docs[0].data() };
        }
        details.push({
          orderId:   ord.id,
          createdAt: ord.createdAt,
          status:    ord.status || "pending",
          buyerId:   ord.buyerId,
          product:   firstProduct,
          count:     ord.items?.length || 0
        });
      }
      if (!cancelled) setOrderDetails(details);
    })();
    return () => { cancelled = true; };
  }, [orders]);

  if (!user || user.role !== "Seller") {
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>
        Access denied.
      </p>
    );
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Could not update order status.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Orders Received</h1>
      {orderDetails.length === 0 ? (
        <p style={styles.none}>No orders yet.</p>
      ) : (
        <div style={styles.grid}>
          {orderDetails.map(o => (
            <div key={o.orderId} style={styles.card}>
              {o.product && (
                <img
                  src={o.product.images}
                  alt={o.product.title}
                  style={styles.image}
                />
              )}
              <div style={styles.info}>
                <p style={styles.orderId}>Order #{o.orderId}</p>
                <p style={styles.productTitle}>
                  {o.product?.title || "Unknown Product"}
                </p>
                <p style={styles.count}>{o.count} items</p>
                <p style={styles.date}>
                  {new Date(o.createdAt).toLocaleString()}
                </p>
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.orderId, e.target.value)}
                  style={styles.select}
                >
                  <option value="pending">Pending</option>
                  <option value="delivering">Delivering</option>
                  <option value="arrived">Arrived</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: { padding: "2rem", maxWidth: "1100px", margin: "0 auto" },
  title:         { fontSize: "1.8rem", marginBottom: "1rem" },
  none:          { color: "#6b7280", textAlign: "center", marginTop: "2rem" },
  grid: {
    display: "grid",
    gap: "1.5rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "contain",
    backgroundColor: "#f9fafb",
  },
  info: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  orderId: {
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  productTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: 0,
  },
  count: {
    fontSize: "0.9rem",
    color: "#374151",
  },
  date: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  select: {
    marginTop: "0.75rem",
    padding: "8px",
    fontSize: "0. nine rem",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    outline: "none",
  },
};
