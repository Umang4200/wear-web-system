require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./src/utils/dbConnection");

const userRoutes = require("./src/routes/UserRoutes");
const categoryRoutes = require("./src/routes/CategoryRoutes");
const productRoutes = require("./src/routes/ProductRoutes");
const addressRouter = require("./src/routes/AddressRoutes");
const wishlistRoutes = require("./src/routes/WishlistRoutes");
const cartRoutes = require("./src/routes/CartRoutes");
const reviewRoutes = require("./src/routes/ReviewRoutes");
const orderRoutes = require("./src/routes/OrderRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const paymentRoutes = require("./src/routes/PaymentRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*"
}));

app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/address", addressRouter);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/review", reviewRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
