import { useState } from "react";
import { useNavigate } from "react-router-dom";

import React from 'react';

function AddProductPage() {
  const navigate = useNavigate();
  const localStorageKey = "ecommerce_products";

  // Inside AddProductPage.js
const getCurrentUser = () => {
    // Use the SAME key as UserContext
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
        ...form,
        id: Date.now(),
        price: parseFloat(form.price),
        discount: parseFloat(form.discount),
        stock_quantity: parseInt(form.stock_quantity),
        images: imagePreviews,
        sellerId: currentUser.id,
      };

      products.push(newProduct);
      localStorage.setItem(localStorageKey, JSON.stringify(products));

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
    navigate("/");
  };

  if (!getCurrentUser()) {
    return React.createElement("p", null, "You need to be logged in to add products.");
  }

  return React.createElement(
    "div",
    { style: styles.pageWrapper },
    React.createElement(
      "div",
      { style: styles.card },
      React.createElement("h2", { style: styles.heading }, "Add New Product"),
      message &&
        React.createElement(
          "div",
          {
            style: message.includes("successfully")
              ? styles.successMessage
              : styles.errorMessage,
          },
          message
        ),
      React.createElement(
        "form",
        { onSubmit: handleSubmit },
        [
          ["Title", "title", "text"],
          ["Price ($)", "price", "number"],
          ["Speed", "speed", "text"],
          ["Capacity", "capacity", "text"],
          ["Brand", "brand", "text"],
          ["Stock Quantity", "stock_quantity", "number"],
          ["Discount (%)", "discount", "number"],
        ].map(([label, name, type]) =>
          React.createElement(
            "div",
            { key: name, style: styles.formGroup },
            React.createElement("label", { style: styles.label }, label),
            React.createElement("input", {
              type: type,
              name: name,
              value: form[name],
              onChange: handleChange,
              placeholder: `Enter ${label.toLowerCase()}`,
              style: styles.input,
              required: ["title", "price", "stock_quantity"].includes(name),
            })
          )
        ),
        React.createElement(
          "div",
          { style: styles.formGroup },
          React.createElement(
            "label",
            { style: styles.label },
            "Product Images (Max 5, 2MB each)"
          ),
          React.createElement("input", {
            id: "productImageInput",
            type: "file",
            accept: "image/*",
            multiple: true,
            onChange: handleImageChange,
            style: styles.fileInput,
          })
        ),
        imagePreviews.length > 0 &&
          React.createElement(
            "div",
            { style: styles.previewContainer },
            React.createElement("label", { style: styles.label }, "Image Previews:"),
            React.createElement(
              "div",
              { style: styles.previews },
              imagePreviews.map((src, idx) =>
                React.createElement("img", {
                  key: idx,
                  src: src,
                  alt: `Preview ${idx + 1}`,
                  style: styles.previewImage,
                })
              )
            )
          ),
        React.createElement(
          "div",
          { style: styles.buttonGroup },
          React.createElement(
            "button",
            { type: "button", onClick: handleCancel, style: styles.cancelButton },
            "Cancel"
          ),
          React.createElement(
            "button",
            { type: "submit", style: styles.submitButton },
            "Add Product"
          )
        )
      )
    )
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    width: "600px",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    fontWeight: 600,
    textAlign: "center",
    color: "#111827",
  },
  formGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    fontSize: "0.875rem",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    color: "#111827",
    backgroundColor: "#fff",
  },
  fileInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
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
    border: "1px dashed #d1d5db",
    borderRadius: "6px",
  },
  previewImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
  },
  successMessage: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "6px",
  },
  errorMessage: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "6px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "2rem",
  },
  cancelButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    borderRadius: "6px",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  submitButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
};

export default AddProductPage;