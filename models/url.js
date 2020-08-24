const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    url: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    views: { type: Number, default: 0 }
});


module.exports = Url = mongoose.model('url', urlSchema);
