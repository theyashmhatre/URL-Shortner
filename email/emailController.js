const User = require("../models/user");
const msgs = require("./emailMsgs");
const sendEmail = require("./sendEmail");
const templates = require("./emailTemplates");


exports.confirmEmail = async (req, res) => {
    const { id } = req.params;

    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findById(id);

            if (!user)
                return res.json({ msg: msgs.couldNotFind });

            if (user.confirmed)
                return res.status(200).json({ msg: msgs.alreadyConfirmed });


            if (user && !user.confirmed) {
                await User.findByIdAndUpdate(id, { confirmed: true });
                sendEmail(user.email, templates.verified());
                return res.status(200).json({ msg: msgs.confirmed });
            }
            return res.status(400).json({ msg: "An error occured" });
        }
        return res.json({ msg: "User does not exist. Invalid ID" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};