const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user");

router.post("/register", async (req, res) => {

    try {
        let { email, password, passwordCheck, name } = req.body;

        //validate

        if (!email || !password || !passwordCheck)
            return res.status(400).json({ msg: "Please fill up all the fields and retry." });
        if (password.length < 6)
            return res.status(400).json({ msg: "Password needs to be atleast 6 characters long" });
        if (password !== passwordCheck)
            return res
                .status(400)
                .json({ msg: "Please enter the same password twice" });

        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "This account already exists." });
        if (!name) name = email;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email,
            password: passwordHash,
            name: name
        });

        const savedUser = await newUser.save();
        res.json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }


});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate

        if (!email || !password)
            return res.status(400).json({ msg: "Please fill up all the field and retry" });

        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({ msg: "No account with this email has been registered." });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ msg: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            user: {
                token,
                id: user._id,
                name: user.name
            },
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        name: user.name,
        id: user._id,
    });
});

module.exports = router;