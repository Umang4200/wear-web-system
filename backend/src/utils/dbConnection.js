const { default: mongoose } = require("mongoose")

exports.dbConnection = () => {
mongoose.connect(process.env.DB_URL)
        .then(() => console.log("DB Connected"))
        .catch((err) => console.log(err))
}