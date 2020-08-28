const User = require("../models/user");
const msgs = require("./emailMsgs");
const sendEmail = require("./sendEmail");
const templates = require("./emailTemplates");


exports.confirmEmail = async (req, res) => {
    const { id } = req.params;

    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("id matched");
            const user = await User.findById(id);

            if (!user)
                return res.json({ msg: msgs.couldNotFind });

            if (user.confirmed)
                return res.status(200).json({ msg: msgs.alreadyConfirmed });


            await User.findByIdAndUpdate(id, { confirmed: true })
                .then(() => res.status(200).json({ msg: msgs.confirmed }));
            sendEmail(user.email, templates.verified());
        }
        return res.json({ msg: "User does not exist. Invalid ID" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};