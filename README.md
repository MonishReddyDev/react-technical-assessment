# Marketplace Frontend – Technical Assessment

This is a React frontend built for the Marketplace Backend API as part of a technical assessment.  
The app includes authentication, protected routes, product browsing (with pagination), product details, cart functionality, and a simple user profile page.

---

## ✅ Features

### 🔐 Authentication
- Login (`POST /auth/login`)
- JWT stored in `localStorage` and `AuthContext`
- Logout support
- Protected routes:
  - `/products`
  - `/cart`
  - `/profile`
  - `/products/:id`

### 🛒 Products
- Fetch and display all products
- **Product list includes pagination**
- Product detail page
- Add to cart from list or details
- Fallback images to avoid broken links

### 🧺 Cart
- Fetch cart
- Add items, update quantity, remove items
- Clear cart
- Cart count shown in Navbar

### 👤 Profile
- View user profile
- Update profile details

---

## 🔧 Tech Stack

- React (Vite)
- React Router DOM
- Axios
- Context API (`Auth` + `Cart`)
- Basic custom CSS

---

## 📁 Project Structure

```
ecommerce-frontend/
│
├── public/
│   ├── image.png               # fallback for product detail page
│   ├── FallBack.webp           # fallback for product cards and cart items
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── pages/
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Products.jsx
│   │   └── Profile.jsx
│   │
│   ├── services/
│   │   └── api.js              # axios instance + API wrappers
│   │
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
│
└── vite.config.js
```
- The `public` folder contains fallback images.

---

## 🚀 Setup Instructions

### 1. Clone the project

```bash
git clone https://github.com/MonishReddyDev/react-technical-assessment.git
cd react-technical-assessment/ecommerce-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the `ecommerce-frontend` directory and add the following:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Start development server

```bash
npm run dev
```

**Backend:**  
Must run at: `http://localhost:3000/api`

---

## 🧑‍💻 Test Login Credentials

- **Email:** john.doe@example.com  
- **Password:** password123

---

## 🧪 App Usage

- **Login:** Redirects to products page
- **Products page:** View items, browse pages (pagination), add to cart
- **Product details:** Displays description, price, stock, fallback images
- **Cart:** Modify quantities, remove items, clear cart
- **Profile:** View and update user data

---

## 📄 Notes

- Axios interceptor automatically attaches JWT token
- All pages include loading/error handling
- Products list supports pagination for easier browsing
- Simple UI focused on core functionality

---
