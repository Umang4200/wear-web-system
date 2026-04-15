import React from "react";
import { Outlet, Navigate, ScrollRestoration } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";

function MainLayout() {
  const role = localStorage.getItem("role");

  // Redirect non-customer authenticated users away from the customer layout
  if (role === "seller") {
    return <Navigate to="/seller" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollRestoration />
      <UserNavbar/>
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;