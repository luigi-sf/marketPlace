import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./contexts/auth/authProvider"
import { SellerProvider } from "./contexts/seller/sellerProvider"
import { AppProviders } from "../src/contexts/providers"
import "./assets/styles/global.scss"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <SellerProvider>
          <AppProviders >
          <App />
          </AppProviders>
        </SellerProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)