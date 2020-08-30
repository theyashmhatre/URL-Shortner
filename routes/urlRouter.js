const router = require("express").Router();
const auth = require("../middleware/auth");
const Url = require("../models/url");
const { nanoid } = require("nanoid");


router.post("/add", auth, async (req, res) => {
    try {

        let { url, slug } = req.body;

        //validate

        if (!url)
            return res.status(400).json({ msg: "Please fill up all the fields and retry." });
        if (!slug) {
            slug = nanoid(4);
        }

        const existingSlug = await Url.findOne({ slug: slug });
        if (existingSlug)
            return res
                .status(400)
                .json({ msg: "This slug has already been taken. Please retry" });

        const newUrl = new Url({
            url,
            slug: slug.toLowerCase(),
            userId: req.user
        });

        const savedUrl = await newUrl.save();
        res.json(savedUrl);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/all", auth, async (req, res) => {
    const urls = await Url.find({ userId: req.user });
    res.json(urls);
});

router.delete("/:id", auth, async (req, res) => {
    const url = await Url.findOne({ userId: req.user, _id: req.params.id });
    if (!url)
        return res.status(400).json({ msg: "No Url Found" });

    const deletedUrl = await Url.findByIdAndDelete(req.params.id);
    res.json(deletedUrl);
});


module.exports = router;