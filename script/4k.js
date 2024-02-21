const axios = require('axios');
const tinyurl = require('tinyurl');

module.exports.config = {
		name: "4k",
		version: "1.0",
		credits: "JARiF",
		cooldown: 15,
		role: 0,
		description: "Upscale your image.",
		usages: "{pn} reply to an image",
		hasPrefix: false,
		aliases: ["enhance", "remini"]
};

module.exports.run = async function ({ message, args, event, api }) {
		const getImageUrl = () => {
				if (event.type === "message_reply") {
						const replyAttachment = event.messageReply.attachments[0];
						if (["photo", "sticker"].includes(replyAttachment?.type)) {
								return replyAttachment.url;
						} else {
								throw new Error("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image.");
						}
				} else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g) || null) {
						return args[0];
				} else {
						throw new Error("(⁠┌⁠・⁠。⁠・⁠)⁠┌ | Reply to an image.");
				}
		};

		try {
				const imageUrl = await getImageUrl();
				const shortUrl = await tinyurl.shorten(imageUrl);

				message.reply("ƪ⁠(⁠‾⁠.⁠‾⁠“⁠)⁠┐ | Please wait...");

				const response = await axios.get(`https://www.api.vyturex.com/upscale?imageUrl=${shortUrl}`);
				const resultUrl = response.data.resultUrl;

				const { data: enhancedImageBuffer } = await axios.get(resultUrl, { responseType: 'arraybuffer' });

				message.reply({ body: "<⁠(⁠￣⁠︶⁠￣⁠)⁠> | Image Enhanced.", attachment: enhancedImageBuffer });
		} catch (error) {
				message.reply("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Error: " + error.message);
				// Log error for debugging: console.error(error);
		}
};
