import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const styles = {
  page: {
    padding: "24px",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  inputContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
  },
  input: {
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "6px",
    width: "260px",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
  buttonHover: {
    backgroundColor: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  cardText: {
    margin: "4px 0",
  },
};

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputId, setInputId] = useState("");

  const getItemById = (id) => {
    const storedItems = JSON.parse(localStorage.getItem("shopItems")) || [];
    return storedItems.find((item) => item.itemid === id);
  };

  const addItemById = (id) => {
    const existing = selectedItems.find((i) => i.itemid === id);
    if (existing) return;

    const foundItem = getItemById(id);
    if (foundItem) {
      const updatedItems = [...selectedItems, foundItem];
      setSelectedItems(updatedItems);
      updateURL(updatedItems);
    }
  };

  const updateURL = (items) => {
    const params = new URLSearchParams();
    items.forEach((item, index) => {
      params.set(`item${index + 1}`, item.itemid);
    });
    navigate(`/compare?${params.toString()}`);
  };

  useEffect(() => {
    const entries = Array.from(searchParams.entries());
    const ids = entries.map(([, value]) => value);
    const foundItems = ids
      .map((id) => getItemById(id))
      .filter((item) => item !== undefined);
    setSelectedItems(foundItems);
  }, [searchParams]);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Compare Items</h2>

      {/* Input to add new item */}
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter item ID (e.g. ram-001)"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
        <button
          onClick={() => {
            addItemById(inputId.trim());
            setInputId("");
          }}
          style={styles.button}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Add
        </button>
      </div>

      {/* Comparison Cards */}
      <div style={styles.grid}>
        {selectedItems.map((item) => (
          <div key={item.itemid} style={styles.card}>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardText}><strong>Price:</strong> ${item.price}</p>
            <p style={styles.cardText}><strong>Speed:</strong> {item.speed} MHz</p>
            <p style={styles.cardText}><strong>Storage:</strong> {item.storage}</p>
            {/* Add more fields as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePage;
