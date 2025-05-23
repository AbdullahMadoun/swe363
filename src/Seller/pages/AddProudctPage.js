import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "../../context/ItemContext"; // Ensure path is correct

function AddProductPage() {
  const navigate = useNavigate();
  const { addItem } = useItems();
  const localStorageKey = "ecommerce_products";

  const getCurrentUser = () => {
    const userString = localStorage.getItem("user");
    try {
      return userString ? JSON.parse(userString) : null;
    } catch (e) {
      console.error("Error parsing user from local storage", e);
      return null;
    }
  };

  const [form, setForm] = useState({
    title: "",
    price: "",
    speed: "",
    stock_quantity: "",
    discount: "",
    brand: "",
    capacity: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage("You can only upload up to 5 images.");
      return;
    }

    const validImages = files.filter((file) => file.size <= 2 * 1024 * 1024);
    if (validImages.length < files.length) {
      setMessage("Each image must be less than 2MB.");
      return;
    }

    setImagePreviews([]);
    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setMessage("Error: You must be logged in to add a product.");
      return;
    }

    if (imagePreviews.length === 0) {
      setMessage("Please upload at least one product image.");
      return;
    }

    try {
      const storedProducts = localStorage.getItem(localStorageKey);
      const products = storedProducts ? JSON.parse(storedProducts) : [];

      const newProduct = {
        id: Date.now(),
        title: form.title,
        base64image: imagePreviews,
        price: parseFloat(form.price),
        discount: parseFloat(form.discount) || 0,
        stock_quantity: parseInt(form.stock_quantity, 10) || 0,
        speed: form.speed,
        capacity: form.capacity,
        brand: form.brand,
        rating: 0,
        sellerId: currentUser.id,
      };

      // Save to localStorage (seller’s products list)
      products.push(newProduct);
      localStorage.setItem(localStorageKey, JSON.stringify(products));

      // Save to context (global item list)
      addItem(newProduct);

      setMessage("Product successfully added!");
      setForm({
        title: "",
        price: "",
        speed: "",
        stock_quantity: "",
        discount: "",
        brand: "",
        capacity: "",
      });
      setImagePreviews([]);
      document.getElementById("productImageInput").value = "";
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage("Something went wrong while saving the product.");
    }
  };

  const handleCancel = () => {
    navigate("/main");
  };

  if (!getCurrentUser()) {
    return <p>You need to be logged in to add products.</p>;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add New Product</h2>
        {message && (
          <div
            style={
              message.includes("successfully")
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {[
            ["Title", "title", "text"],
            ["Price ($)", "price", "number"],
            ["Speed", "speed", "text"],
            ["Capacity", "capacity", "text"],
            ["Brand", "brand", "text"],
            ["Stock Quantity", "stock_quantity", "number"],
            ["Discount (%)", "discount", "number"],
          ].map(([label, name, type]) => (
            <div key={name} style={styles.formGroup}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                style={styles.input}
                required={["title", "price", "stock_quantity"].includes(name)}
              />
            </div>
          ))}
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Images (Max 5, 2MB each)</label>
            <input
              id="productImageInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={styles.fileInput}
            />
          </div>
          {imagePreviews.length > 0 && (
            <div style={styles.previewContainer}>
              <label style={styles.label}>Image Previews:</label>
              <div style={styles.previews}>
                {imagePreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    style={styles.previewImage}
                  />
                ))}
              </div>
            </div>
          )}
          <div style={styles.buttonGroup}>
            <button type="button" onClick={handleCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "1rem",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "640px",
    padding: "2rem 1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e5e5",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    fontWeight: 600,
    textAlign: "center",
    color: "#000000",
  },
  formGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    fontSize: "0.875rem",
    color: "#111111",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "1px solid #b0b0b0",
    borderRadius: "8px",
    color: "#000000",
    backgroundColor: "#ffffff",
    outlineColor: "#000000",
    boxSizing: "border-box",
  },
  fileInput: {
    width: "100%",
    padding: "0.6rem",
    border: "1px solid #b0b0b0",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#000000",
    boxSizing: "border-box",
  },
  previewContainer: {
    marginTop: "1rem",
    marginBottom: "1.25rem",
  },
  previews: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "0.5rem",
    padding: "10px",
    border: "1px dashed #b0b0b0",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  previewImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #cccccc",
  },
  successMessage: {
    backgroundColor: "#e0ffe0",
    color: "#006400",
    border: "1px solid #90ee90",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
  },
  errorMessage: {
    backgroundColor: "#ffeaea",
    color: "#990000",
    border: "1px solid #ff9999",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginTop: "2rem",
    alignItems: "stretch",
  },
  cancelButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#e0e0e0",
    color: "#000000",
    borderRadius: "6px",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
  },
  submitButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: "6px",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
  },
};


export default AddProductPage;
