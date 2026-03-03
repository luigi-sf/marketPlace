import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./components/hooks/useAuth"

import LoginPage from "./pages/auth/login"
import SignupPage from "./pages/auth/signup"
import Home from "./pages/home"
import SellerPage from "./pages/seller/sellerPage"
import ProductsPage from "./pages/products/product"
import CategoryPage from "./pages/products/category"
import PendingSellers from "./pages/admin/adminPendents"
import MyProductsPage from "./pages/products/myProduct"
import EditProductPage from "./pages/products/editProduct"
import ActiveUsersPage from "./pages/admin/activeUsers"
import ActiveProductsPage from './pages/admin/adminProduct'

import AppLayout from "./assets/layouts/topBarLayout"
import AdminDashboardPage from "./pages/admin/adminDashboard"

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
          <Route path="/home" element={<Home />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/me" element={<MyProductsPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/sellers" element={<SellerPage />} />
           <Route path="/admin" element={<AdminDashboardPage />} />
           <Route path="/admin/activeUsers" element={<ActiveUsersPage />} />
             <Route path="/admin/viewProducts" element={<ActiveProductsPage/>} />
          {/*  Passa token diretamente do useAuth */}
          <Route path="/admin/pending" element={<PendingSellers token={token} />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* fallback autenticado */}
      {token && (
        <Route path="*" element={<Navigate to="/home" replace />} />
      )}
    </Routes>
  )
}