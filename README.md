# 💻 Techmart

**Techmart** is a modern e-commerce platform built for technology lovers. It supports multiple user roles including buyers, sellers, and admins. Users can explore, manage, and administrate a wide array of tech products with an intuitive and clean interface, powered by a Firebase backend. Whether you’re looking to buy components or manage your own product listings, Techmart has you covered.

---

## 📦 Features

### 🛒 Buyer Interface
- Browse tech products with clean item cards
- Use powerful filters (brand, capacity, price, rating)
- Add items to:
  - Cart
  - Wishlist
  - Compare list
- View product details, discounts, and specs
- Fully responsive for both desktop and mobile

### 🧑‍💼 Seller Dashboard
- Add, edit, and delete your products
- Upload multiple product images (with live preview)
- Enter details like capacity, speed, brand, stock, discount, and price
- View seller-specific product listings and orders

### 🛡️ Admin Panel
- Manage user accounts (`/Admin/accounts`)
- Control policies using markdown (`/Admin/policycontrol`)
- View rendered policy at `/policy`

### 🖼️ Image Support
- Product images uploaded as base64 (stored alongside product data)
- Previews available before submission
- Image cards shown on wishlist, cart, and compare pages

### 📝 Markdown Rendering
- Policies and help documents rendered using `react-markdown`

---

## ⚙️ Technologies & Dependencies

- `react-router-dom` – Routing and navigation
- `lucide-react` – Icon library
- `react-markdown` – Policy markdown rendering
- `styled-components` – Scoped and modular styling
- `firebase` – Backend services (Authentication, Firestore Database, Storage)

### 📥 Install Dependencies

```bash
npm install react-router-dom
npm install lucide-react
npm install react-markdown
npm install styled-components
npm install firebase
```

---

## 🚀 Usage Instructions

### 🛍️ Buyer Side

- *Browse Products*
  From the main page, buyers can filter, sort, and search for tech products.

- *Wishlist*
  Save favorite items for later.

- *Shopping Cart*
  Add items to cart, view total, and proceed to checkout.

- *Payment*
  Enter card details to complete the purchase.

- *View Orders & Submit Reviews*
  Buyers can rate and review products post-delivery.

### 🛒 Seller Side

- *My Products*
  View and edit your listings.

- *Add Product*
  Add new listings using the product form.

- *Orders*
  Track orders made for your listed items.

### ⚙️ Admin Side

- *Accounts Management*
  View, update, or remove user accounts.

- *Policy Management*
  Admins can write and publish markdown-formatted site policies.

---

### 👥 Team Members

- *Abdullah Madoun* — Developer & Admin Interface
- *Khalid* — Seller Role Logic
- *Mohammad* — Buyer Interface & Testing

---

### 🔐 Environment Notes

- Requires Firebase configuration. Set up a Firebase project and add your configuration details (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) typically in an environment file (e.g., `.env`) or a configuration file (`firebaseConfig.js`).
- All user, product, and order data is stored and managed using Firebase services (Firestore, Authentication).

