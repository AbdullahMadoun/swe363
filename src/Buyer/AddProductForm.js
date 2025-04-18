import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function AddProductForm() {
  const navigate = useNavigate();
  const localStorageKey = 'ecommerce_products'; // Key for storing products

  const [form, setForm] = useState({
    title: "",
    price: "",
    speed: "",
    stockQuantity: 0,
    discountPercentage: 0,
  });
  const [imagePreviews, setImagePreviews] = useState([]); // State for image data URLs
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    setForm((prev) => ({ ...prev, [name]: processedValue }));
    setMessage('');
  };

  // --- Handler for image file selection ---
  const handleImageChange = (e) => {
    setMessage('');
    const files = Array.from(e.target.files); // Convert FileList to array
    const maxFiles = 5; // Limit number of files
    const maxSize = 2 * 1024 * 1024; // Limit file size (e.g., 2MB)

    if (files.length > maxFiles) {
        setMessage(`You can only upload a maximum of ${maxFiles} images.`);
        e.target.value = null; // Clear the selection
        return;
    }

    const newPreviews = [];
    let processingCount = files.length; // Counter for async operations

    files.forEach((file) => {
        if (file.size > maxSize) {
            setMessage(`File "${file.name}" is too large (max ${maxSize / 1024 / 1024}MB).`);
            processingCount--; // Decrement counter as this file is skipped
            if (processingCount === 0) {
                // Update state if this was the last file (even if invalid)
                setImagePreviews(prev => [...prev, ...newPreviews]);
            }
             e.target.value = null; // Consider clearing selection if any file is invalid
            return; // Skip this file
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // reader.result contains the Base64 Data URL
            newPreviews.push(reader.result);
            processingCount--; // Decrement counter when a file is processed
            if (processingCount === 0) {
                 // Update state only after all files are processed
                 // Combine existing previews with new ones if desired, or replace
                 // For simplicity, let's replace current selection with new selection
                 setImagePreviews(newPreviews);
            }
        };
        reader.onerror = () => {
            console.error("Error reading file:", file.name);
            setMessage(`Error reading file "${file.name}".`);
            processingCount--; // Decrement counter on error
             if (processingCount === 0) {
                 setImagePreviews(newPreviews); // Update with successfully read files if any
            }
        };
        reader.readAsDataURL(file); // Read the file as Data URL
    });

     // If no files were selected initially (e.g., user cancelled)
     if (files.length === 0) {
       // Decide if you want to clear existing previews or keep them
       // setImagePreviews([]); // Option to clear previews if selection is cancelled
     }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    // Basic validation: check if at least one image is selected
    if (imagePreviews.length === 0) {
        setMessage('Please select at least one product image.');
        return;
    }

    try {
      const storedProducts = localStorage.getItem(localStorageKey);
      let products = [];

      if (storedProducts) {
        try {
          products = JSON.parse(storedProducts);
          if (!Array.isArray(products)) {
            console.warn("Stored data is not an array, resetting.");
            products = [];
          }
        } catch (parseError) {
          console.error("Error parsing products from local storage:", parseError);
          products = [];
          setMessage('Error reading stored products. Starting fresh.');
        }
      }

      // --- Add the image data (Base64 strings) to the product ---
      const newProduct = {
        ...form,
        id: Date.now(),
        images: imagePreviews // Store the array of Data URLs
      };
      products.push(newProduct);

      const updatedProductsJson = JSON.stringify(products);

      // --- Check size before saving (optional but recommended for local storage) ---
      if (updatedProductsJson.length > 4.5 * 1024 * 1024) { // ~4.5MB limit check
          setMessage('Error: Not enough local storage space to save product with images.');
          console.error('Local storage limit likely exceeded.');
          return; // Prevent saving if too large
      }

      localStorage.setItem(localStorageKey, updatedProductsJson);

      console.log("Product Added:", newProduct);
      setMessage('Product successfully added!');

      // --- Clear the form and image previews ---
      setForm({
        title: "",
        price: 0,
        speed: "",
        stockQuantity: 0,
        discountPercentage: 0,
      });
      setImagePreviews([]); // Clear image previews
      // Clear the file input visually (requires accessing the input element, e.g., via ref)
       if (document.getElementById('productImageInput')) {
           document.getElementById('productImageInput').value = null;
       }


    } catch (error) {
      console.error("Failed to save product to local storage:", error);
      setMessage('Failed to save product. Please try again.');
    }
  };

  const handleCancel = () => {
    // Clear form and previews on cancel too
     setForm({
        title: "", price: 0, speed: "", stockQuantity: 0, discountPercentage: 0,
      });
     setImagePreviews([]);
     if (document.getElementById('productImageInput')) {
           document.getElementById('productImageInput').value = null;
       }
    navigate(-1);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add New Product</h2>

        {message && (
          <div style={message.includes('Error') || message.includes('Failed') || message.includes('too large') || message.includes('maximum') ? styles.errorMessage : styles.successMessage}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ... other form fields (Title, Price, etc.) ... */}
           <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input type="text" name="title" placeholder="e.g., Corsair Vengeance LPX RAM" value={form.title} onChange={handleChange} style={styles.input} required={true}/>
           </div>
           <div style={styles.formGroup}>
             <label style={styles.label}>Price ($)</label>
             <input type="number" name="price" placeholder="e.g., 56.00" value={form.price} onChange={handleChange} style={styles.input} required={true} min="0" step="0.01"/>
           </div>
           <div style={styles.formGroup}>
            <label style={styles.label}>Technichal Specification / Speed </label>
            <input type="text" name="speed" placeholder="e.g., DDR4 3200 (PC4-25600)" value={form.speed} onChange={handleChange} style={styles.input} />
           </div>
            <div style={styles.formGroup}>
            <label style={styles.label}>Stock Quantity</label>
            <input type="number" name="stockQuantity" placeholder="e.g., 100" value={form.stockQuantity} onChange={handleChange} style={styles.input} required={true} min="0"/>
           </div>
           <div style={styles.formGroup}>
             <label style={styles.label}>Discount Percentage (%)</label>
             <input type="number" name="discountPercentage" placeholder="e.g., 10" value={form.discountPercentage} onChange={handleChange} style={styles.input} min="0" max="100"/>
           </div>


          {/* --- Product Image Input --- */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Images (Max 5, 2MB each)</label>
            <input
              id="productImageInput" // Added ID for easier clearing
              type="file"
              name="images"
              accept="image/*" // Accept any image type
              multiple // Allow multiple files
              onChange={handleImageChange}
              style={styles.fileInput}
              // required // Make image selection mandatory if needed
            />
          </div>

           {/* --- Image Previews --- */}
          {imagePreviews.length > 0 && (
            <div style={styles.previewContainer}>
              <label style={styles.label}>Selected Image Previews:</label>
              <div style={styles.previews}>
                  {imagePreviews.map((previewSrc, index) => (
                    <img
                      key={index}
                      src={previewSrc}
                      alt={`Preview ${index + 1}`}
                      style={styles.previewImage}
                    />
                  ))}
              </div>
            </div>
          )}


          {/* Buttons */}
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

// --- Styles ---
const styles = {
  // ... (keep existing styles: pageWrapper, card, heading, formGroup, label, input, messages, buttonGroup, buttons)
  pageWrapper: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start", // Align top for scrollable form
    padding: "2rem",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#fff",
    width: "600px", // Increased width slightly
    maxWidth: "95%",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: '2rem', // Add margin at the bottom
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
    boxSizing: "border-box",
    color: "#111827",
    backgroundColor: "#fff",
    lineHeight: "1.5",
    appearance: "none",
  },
   'input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
  },
  'input[type=number]': {
      '-moz-appearance': 'textfield'
  },
  // Style for the file input
  fileInput: {
    width: "100%",
    padding: "0.5rem", // Adjust padding as needed
    fontSize: '0.9rem',
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
    cursor: 'pointer',
    // Basic browser styling for file input is often hard to override completely
    // Consider using a label styled as a button to trigger the input
  },
   // Container for previews
  previewContainer: {
    marginTop: '1rem',
    marginBottom: "1.25rem",
  },
  // Flex container for multiple previews
  previews: {
      display: 'flex',
      flexWrap: 'wrap', // Allow wrapping
      gap: '10px', // Space between previews
      marginTop: '0.5rem',
      padding: '10px',
      border: '1px dashed #d1d5db', // Optional border
      borderRadius: '6px',
      minHeight: '60px', // Minimum height
  },
  // Style for individual preview images
  previewImage: {
    width: '80px', // Fixed width for previews
    height: '80px', // Fixed height for previews
    objectFit: 'cover', // Crop image nicely
    borderRadius: '4px', // Slightly rounded corners for previews
    border: '1px solid #e5e7eb', // Light border
  },
  messageBase: {
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
  successMessage: {
    padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '6px', fontSize: '0.875rem', textAlign: 'center',
    backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac',
  },
  errorMessage: {
     padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '6px', fontSize: '0.875rem', textAlign: 'center',
     backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5',
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "2rem",
  },
  cancelButton: {
    padding: "0.75rem 1.5rem", backgroundColor: "#e5e7eb", color: "#1f2937", borderRadius: "6px", border: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "background-color 0.2s",
  },
  submitButton: {
    padding: "0.75rem 1.5rem", backgroundColor: "#2563eb", color: "#fff", borderRadius: "6px", border: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "background-color 0.2s",
  },
};

export default AddProductForm;