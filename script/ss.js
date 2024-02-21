const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
	name: "ss",
	aliases: ["screenshot"],
	credits: "kshitiz",
	version: "1.0",
	cooldown: 0,
	role: 2,
	description: "Generate a screenshot of a webpage.",
	hasPrefix: false,
};

module.exports.run = async function ({ api, event, args, message }) {
	try {
		api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
		let url;

		if (event.type === "message_reply") {
			if (event.messageReply.body && event.messageReply.body.startsWith("http")) {
				url = event.messageReply.body;
			} else {
				return message.reply("The replied message does not contain a valid URL.");
			}
		} else {
			if (args.length === 0) {
				return message.reply("Please provide a URL.");
			}
			url = args[0];
		}

		const response = await axios.get(`https://ss-kshitizz.onrender.com/ss?url=${encodeURIComponent(url)}`, { responseType: "stream" });

		const imagePath = path.join(__dirname, `/cache/ss_${Date.now()}.png`);
		const writer = fs.createWriteStream(imagePath);
		response.data.pipe(writer);

		await new Promise((resolve, reject) => {
			writer.on("finish", resolve);
			writer.on("error", reject);
		});

		await message.reply({
			body: "Screenshot generated:",
			attachment: fs.createReadStream(imagePath)
		});

		fs.unlinkSync(imagePath);
		api.setMessageReaction("💚", event.messageID, (err) => {}, true);
	} catch (error) {
		message.reply(`Error: ${error.message}`);
	}
};
