const Category = require("../models/CategoryModel");

exports.addCategory = async (req, res) => {
    try {
        let { name, parentCategoryId, level } = req.body;

        if (!name || !level) {
            return res.status(400).json({
                success: false,
                message: "name and level required"
            })
        }

        let savedCategory = await Category.create({ name, parentCategoryId, level });

        res.status(201).json({
            success: true,
            message: "category created successfully",
            data: savedCategory
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while creating category",
            error: error
        })
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        .populate("parentCategoryId").sort({level:1});

        res.status(200).json({
            success: true,
            data: categories,
            message: "category fetched successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while fetching categories",
            error: error
        })
    }
}