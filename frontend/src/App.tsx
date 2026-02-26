import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./components/hooks/useAuth"

import LoginPage from "./pages/auth/login"
import SignupPage from "./pages/auth/signup"
import DashboardPage from "./pages/dashboard"
import SellerPage from "./pages/seller/sellerPage"
import ProductsPage from "./pages/products/product"
import CategoryPage from "./pages/products/category"
import PendingSellers from "./pages/admin"
import MyProductsPage from "./pages/products/myProduct"
import EditProductPage from "./pages/products/editProduct"

import AppLayout from "./assets/layouts/topBarLayout"

export default function App() {
  const { token } = useAuth()

  return (
    <Routes>
      {/* 🔓 Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />

      {/* 🔒 Protegidas */}
      {token ? (
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/products" element={<ProductsPage />} />
           <Route path="/products/me" element={<MyProductsPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/sellers" element={<SellerPage />} />
          <Route path="/sellers/pending" element={<PendingSellers />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* fallback autenticado */}
      {token && (
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      )}
    </Routes>
  )
}