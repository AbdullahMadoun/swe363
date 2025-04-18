import React, { useState, useEffect, useContext } from "react";
import ItemCard from "./ItemCard";
import { CartContext } from "./CartContext";

const base64Placeholder = "iVBORw0KGgoAAAANSUhEUgAAAAUA...";

const defaultItems = [
  {
    itemid: "ram-001",
    ownerid: "user123",
    title: "Corsair Vengeance LPX 16GB DDR4",
    price: 43.99,
    speed: 3200,
    stock_quantity: 10,
    discount: 0,
    base64image: `data:image/png;base64,${base64Placeholder}`,
    brand: "Corsair",
    capacity: "16GB",
    rating: 4.5,
  },
  {
    itemid: "ram-002",
    ownerid: "user123",
    title: "Corsair Vengeance LPX 8GB DDR4",
    price: 29.99,
    speed: 3200,
    stock_quantity: 5,
    discount: 10,
    base64image: `data:image/png;base64,${base64Placeholder}`,
    brand: "Corsair",
    capacity: "8GB",
    rating: 4.0,
  },
  {
    itemid: "ram-003",
    ownerid: "user456",
    title: "Kingston FURY Beast 16GB DDR4",
    price: 39.99,
    speed: 3600,
    stock_quantity: 0,
    discount: 5,
    base64image: `data:image/png;base64,${base64Placeholder}`,
    brand: "Kingston",
    capacity: "16GB",
    rating: 3.8,
  },
  {
    itemid: "ram-004",
    ownerid: "user789",
    title: "Kingston FURY Beast 32GB DDR5",
    price: 79.99,
    speed: 4800,
    stock_quantity: 12,
    discount: 15,
    base64image: `data:image/png;base64,${base64Placeholder}`,
    brand: "Kingston",
    capacity: "32GB",
    rating: 4.7,
  },
];

function MainPage() {
  const [items, setItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState("");
  const { addToCart } = useContext(CartContext);

  const [minRating, setMinRating] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [brands, setBrands] = useState(["Corsair", "Crucial", "Kingston"]);
  const [sizes, setSizes] = useState(["8GB", "16GB", "32GB"]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortOrder, setSortOrder] = useState("price-asc");

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("shopItems"));
    if (storedItems && storedItems.length > 0) {
      setItems(storedItems);
    } else {
      setItems(defaultItems);
      localStorage.setItem("shopItems", JSON.stringify(defaultItems));
    }
  }, []);

  const addKeyword = (word) => {
    const cleaned = word.trim().toLowerCase();
    if (cleaned && !keywords.includes(cleaned)) {
      setKeywords([...keywords, cleaned]);
    }
    setInput("");
  };

  const removeKeyword = (word) => {
    setKeywords(keywords.filter((kw) => kw !== word));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.includes(" ")) {
      const words = value.split(" ");
      words.forEach((w) => addKeyword(w));
    } else {
      setInput(value);
    }
  };

  const suggestions = [...new Set(items.map((item) => item.title.toLowerCase().split(" ")).flat())]
    .filter((word) => word.startsWith(input.toLowerCase()) && !keywords.includes(word))
    .slice(0, 5);

  const filteredItems = items.filter((item) => {
    const finalPrice = item.price - (item.price * item.discount) / 100;
    const titleLower = item.title.toLowerCase();
    return (
      keywords.every((kw) => titleLower.includes(kw)) &&
      (!minRating || item.rating >= 4) &&
      (!freeDelivery || item.freeDelivery) &&
      brands.includes(item.brand) &&
      sizes.includes(item.capacity) &&
      finalPrice >= priceRange[0] &&
      finalPrice <= priceRange[1]
    );
  });

  const sortItems = (items) => {
    switch (sortOrder) {
      case "price-asc":
        return [...items].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...items].sort((a, b) => b.price - a.price);
      case "rating":
        return [...items].sort((a, b) => b.rating - a.rating);
      default:
        return items;
    }
  };

  const toggleBrand = (brand) => {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div style={styles.pageWrapper}>
      <aside style={styles.sidebar}>
        <h3>Keywords</h3>
        <input
          type="text"
          placeholder="e.g. Ram"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && addKeyword(input)}
          style={styles.input}
        />
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => addKeyword(s)}
            style={{
              cursor: "pointer",
              fontSize: "0.85rem",
              color: "#555",
              padding: "2px 4px",
            }}
          >
            {s}
          </div>
        ))}
        <div style={{ marginTop: "10px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {keywords.map((kw) => (
            <div
              key={kw}
              style={{
                background: "#1d1d1f",
                color: "#fff",
                borderRadius: "16px",
                padding: "4px 10px",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {kw}
              <button
                onClick={() => removeKeyword(kw)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
          {keywords.length > 0 && (
            <button
              onClick={() => setKeywords([])}
              style={{
                backgroundColor: "#eee",
                border: "none",
                borderRadius: "12px",
                padding: "4px 8px",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              Clear all
            </button>
          )}
        </div>

        <div style={styles.checkbox}>
          <input
            type="checkbox"
            checked={minRating}
            onChange={(e) => setMinRating(e.target.checked)}
          />
          <label>4 & Above Rating</label>
        </div>
        <div style={styles.checkbox}>
          <input
            type="checkbox"
            checked={freeDelivery}
            onChange={(e) => setFreeDelivery(e.target.checked)}
          />
          <label>Free Delivery</label>
        </div>
        <label style={{ marginTop: "10px" }}>Price</label>
        <input
          type="range"
          min="0"
          max="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "0.9rem" }}>
          ${priceRange[0]}–${priceRange[1]}
        </div>
        <label style={{ marginTop: "10px" }}>Brand</label>
        {["Corsair", "Crucial", "Kingston"].map((brand) => (
          <div key={brand} style={styles.checkbox}>
            <input
              type="checkbox"
              checked={brands.includes(brand)}
              onChange={() => toggleBrand(brand)}
            />
            <label>{brand}</label>
          </div>
        ))}
        <label style={{ marginTop: "10px" }}>Size</label>
        {["8GB", "16GB", "32GB"].map((size) => (
          <div key={size} style={styles.checkbox}>
            <input
              type="checkbox"
              checked={sizes.includes(size)}
              onChange={() => toggleSize(size)}
            />
            <label>{size}</label>
          </div>
        ))}
      </aside>

      <div style={{ flex: 1 }}>
        <div style={styles.topBar}>
          <input
            type="text"
            placeholder="Ram"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && addKeyword(input)}
            style={styles.searchBar}
          />
          <div style={styles.sortBar}>
            <button
              onClick={() => setSortOrder("price-asc")}
              style={sortOrder === "price-asc" ? styles.activeSortBtn : styles.sortBtn}
            >
              ✓ Price ascending
            </button>
            <button
              onClick={() => setSortOrder("price-desc")}
              style={sortOrder === "price-desc" ? styles.activeSortBtn : styles.sortBtn}
            >
              Price descending
            </button>
            <button
              onClick={() => setSortOrder("rating")}
              style={sortOrder === "rating" ? styles.activeSortBtn : styles.sortBtn}
            >
              Rating
            </button>
          </div>
        </div>

        <section style={styles.itemsGrid}>
          {filteredItems.length === 0 ? (
            <p>No items match your criteria.</p>
          ) : (
            sortItems(filteredItems).map((item) => (
              <ItemCard key={item.itemid} item={item} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    backgroundColor: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1d1d1f",
    padding: "20px",
  },
  sidebar: {
    width: "240px",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e5e5",
    backgroundColor: "#fafafa",
    marginRight: "20px",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "6px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "16px",
    flexWrap: "wrap",
  },
  searchBar: {
    flexGrow: 1,
    padding: "10px 16px",
    borderRadius: "9999px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    fontSize: "0.95rem",
    color: "#111827",
    minWidth: "200px",
  },
  sortBar: {
    display: "flex",
    gap: "10px",
  },
  sortBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontWeight: "500",
    color: "#555",
  },
  activeSortBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: "#1d1d1f",
    color: "#fff",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  itemsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    flex: 1,
  },
};

export default MainPage;
