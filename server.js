require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const Url = require("./models/url");
const PORT = process.env.PORT || 4000;
const { nanoid } = require("nanoid");
const cors = require("cors");
app.use(cors());
app.use(express.json());


app.get("/:slug", async (req, res, next) => {
    const id = req.params.slug;
    try {
        const foundURL = await Url.findOne({ slug: id });

        if (foundURL) {
            Url.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } }, { new: true }, function (err, response) {
                if (err) {
                    next(err);
                } else {
                    next(response);
                }
            });
            res.redirect(foundURL.url);
        }
    } catch (error) {
        console.log(error);
    }
});

app.patch("/:slug", async (req, res, callback) => {
    const id = req.params.slug;

    try {
        Url.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } }, { new: true }, function (err, response) {
            if (err) {
                callback(err);
            } else {
                callback(response);
            }
        });

    } catch (error) {
        console.log(error);
    }
});

app.use(express.static('client/src/public'))

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));


mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) throw err;
        console.log("MongoDB connection established");
    }
);

app.use("/users", require("./routes/userRouter"));
app.use("/url", require("./routes/urlRouter"));