import React, { useState, useContext,useEffect } from "react";
import ItemCard from "./ItemCard";
import { CartContext } from "./CartContext";
import { useItems } from './context/ItemContext';

function MainPage() {
 
  const { items } = useItems();

  const { addToCart } = useContext(CartContext);

  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState("");

  const [minRating, setMinRating] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);

  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100); // Default fallback
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortOrder, setSortOrder] = useState("price-asc");

  useEffect(() => {
    const uniqueBrands = Array.from(
      new Set(items.map((item) => item.brand).filter(Boolean))
    );
    setBrands(uniqueBrands);

    const uniqueSizes = Array.from(
      new Set(items.map((item) => item.capacity).filter(Boolean))
    );
    setSizes(uniqueSizes);
  }, [items]);
  const addKeyword = (word) => {
    const cleaned = word.trim().toLowerCase();
    if (cleaned && !keywords.includes(cleaned)) {
      setKeywords([...keywords, cleaned]);
    }
    setInput("");
  };
  useEffect(() => {
    if (items.length > 0) {
      const max = Math.max(...items.map((item) => {
        const finalPrice = item.price - (item.price * item.discount) / 100;
        return finalPrice;
      }));
      setMaxPrice(Math.ceil(max));
    }
  }, [items]);
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
      const titleLower = item.title?.toString().toLowerCase() || '';
    
      const matchesKeywords =
        keywords.length === 0 || keywords.every((kw) => titleLower.includes(kw));
    
      const matchesRating =
        !minRating || item.rating >= 4;

    
      const matchesBrand =
        brands.length === 0 || brands.includes(item.brand);
    
      const matchesSize =
        sizes.length === 0 || sizes.includes(item.capacity);
    
      const matchesPrice =
        finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    
      return (
        matchesKeywords &&
        matchesRating &&
        matchesBrand &&
        matchesSize &&
        matchesPrice
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
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "0.9rem" }}>
          ${priceRange[0]}–${priceRange[1]}
        </div>
        <label style={{ marginTop: "10px" }}>Brand</label>
        {brands.map((brand) => (
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
        {sizes.map((size) => (
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
              <ItemCard key={item.id} item={item} />
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