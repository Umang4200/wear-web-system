const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parentCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        require: true,
    },
    level: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Category", categorySchema)