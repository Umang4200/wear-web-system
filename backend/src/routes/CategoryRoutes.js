const { addCategory, getAllCategories } = require("../controllers/CategoryController");

const categoryRoutes = require("express").Router();

categoryRoutes.post("/category", addCategory);
categoryRoutes.get("/categories", getAllCategories)

module.exports = categoryRoutes;