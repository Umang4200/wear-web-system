const addressRouter = require("express").Router();

const {
  addAddress,
  deleteAddress,
  getAddressByUserId,
  updateAddress,
} = require("../controllers/AddressController");
const { validateToken } = require("../middleware/AuthMiddleware");

addressRouter.post("/add-address", validateToken, addAddress);
addressRouter.get("/get-address", validateToken, getAddressByUserId);
addressRouter.put("/update-address/:addressId", validateToken, updateAddress);
addressRouter.delete("/delete-address", validateToken, deleteAddress);

module.exports = addressRouter;
