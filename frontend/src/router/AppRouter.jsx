import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

import MainLayout from "../components/Customer/MainLayout";
import HomePage from "../pages/HomePage";

import SellerLayout from "../components/Seller/SellerLayout";
import AdminLayout from "../components/Admin/AdminLayout";
import AdminDashboard from "../components/Admin/AdminDashboard";
import UsersManagement from "../components/Admin/UsersManagement";
import SellersManagement from "../components/Admin/SellersManagement";
import CategoryManagement from "../components/Admin/CategoryManagement";
import AdminProfile from "../components/Admin/AdminProfile";
import CustomerProfileLayout from "../components/Customer/CustomerProfileLayout";
import Order from "../components/Seller/Order";
import ProtectedRoutes from "../components/ProtectedRoutes";
import AddProduct from "../pages/seller/AddProduct";
import Products from "../pages/seller/Products";
import UpdateProduct from "../pages/seller/UpdateProduct";
import SellerProfile from "../pages/seller/SellerProfile";
import Wishlist from "../pages/customer/Wishlist";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import ProductDetail from "../pages/customer/ProductDetail";
import CategoryProducts from "../pages/customer/CategoryProducts";
import SearchPage from "../pages/customer/SearchPage";
import Profile from "../pages/customer/Profile";
import Orders from "../pages/customer/Orders";
import Address from "../pages/customer/Address";
import OrderDetails from "../pages/customer/OrderDetails";
import AllReviews from "../pages/customer/AllReviews";
import SellerDashboard from "../pages/seller/SellerDashboard";
import Payment from "../pages/seller/Payment";

const router = createBrowserRouter([
  {
    path: "/",

    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "profile",
        element: <CustomerProfileLayout />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "orders", element: <Orders /> },
          { path: "order/:id", element: <OrderDetails /> },
          { path: "addresses", element: <Address /> },
        ],
      },
      { path: "wishlist", element: <Wishlist /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "productdetail/:productId", element: <ProductDetail /> },
      { path: "product-reviews/:productId", element: <AllReviews /> },
      { path: "products/category/:categoryId", element: <CategoryProducts /> },
      { path: "/search", element: <SearchPage /> },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  {
    path: "/seller",
    element: (
      <ProtectedRoutes userRoles={["seller"]}>
        <SellerLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <SellerDashboard /> },
      { path: "addproduct", element: <AddProduct /> },
      { path: "updateproduct/:id", element: <UpdateProduct /> },
      { path: "orders", element: <Order /> },
      { path: "products", element: <Products /> },
      { path: "payment", element: <Payment /> },
      { path: "profile", element: <SellerProfile /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoutes userRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <UsersManagement /> },
      { path: "sellers", element: <SellersManagement /> },
      { path: "categories", element: <CategoryManagement /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
