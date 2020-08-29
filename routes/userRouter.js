const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user");
const emailController = require("../email/emailController");
const sendEmail = require("../email/sendEmail");
const templates = require("../email/emailTemplates");
const msgs = require("../email/emailMsgs");
const Url = require("../models/url");

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
            email: email.toLowerCase(),
            password: passwordHash,
            name: name
        });

        const savedUser = await newUser.save();
        sendEmail(email, templates.confirm(savedUser._id));
        res.status(200).json({ savedUser, msg: msgs.confirm });
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

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(400).json({ msg: "No account with this email has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ msg: "Invalid Credentials" });

        if (!user.confirmed) {
            sendEmail(user.email, templates.confirm(user._id));
            return res.status(400).json({ msg: msgs.resend });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name
            },
            msg: msgs.confirmed
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/delete", auth, async (req, res) => {
    try {
        let { email } = req.body;
        const user = await User.findById(req.user);


        if (email.toLowerCase() !== user.email.toLowerCase())
            return res
                .status(400)
                .json({ msg: "Invalid Email. Please enter the correct email and retry." });

        const deletedUser = await User.findByIdAndDelete(user._id);
        const deletedURL = await Url.deleteMany({ userId: user._id });
        sendEmail(email, templates.deleted());
        return res.status(200).json({ msg: msgs.deleted });
    } catch (err) {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    if (!user)
        return res.status(400).json({ msg: "Error 404 : User Not Found" });
    res.json({
        name: user.name,
        id: user._id,
    });
});

router.get("/email/confirm/:id", emailController.confirmEmail);

module.exports = router;