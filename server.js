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


app.use("/users", require("./routes/userRouter"));
app.use("/url", require("./routes/urlRouter"));

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get("/wake-up", (req, res) => res.json("👌"));

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'Not Found' });
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

