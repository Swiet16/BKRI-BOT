const axios = require("axios");

module.exports = {
        config: {
                name: 'pi',
                version: '1.0.1',
                author: 'Null69 & Aliester Crowley',
                countDown: 10,
                role: 0,
                category: 'Ai',
                shortDescription: {
                        en: 'Pi (inflextion-1)',
                },
                longDescription: {
                        en: 'Pi (inflection-1)',
                },
                guide: {
                        en: '{pn} [prompt]\n{pn} reset (to reset conversation)',
                },
        },

        onStart: async function({ api, message, event, args, commandName }) {
                let prompt = args.join(" ");

                if (prompt === 'reset') {
                                const resetUrl = `https://pi.aliestercrowley.com/api/reset?uid==${event.senderID}`;

                                try {
                                                await axios.get(resetUrl);
                                                message.reply("Conversation reset successfully.");
                                } catch (error) {
                                                console.error(error.message);
                                                message.reply("An error occurred while resetting the conversation.");
                                }
                                return;
                }

                if (!prompt) {
                        message.reply("Please provide a query.");
                        return;
                }


                api.setMessageReaction("🟡", event.messageID, () => {}, true);

                const url = `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}&username=${event.senderID}`;

                try {
                        const response = await axios.get(url);
                        const result = response.data.response;

                        message.reply(`${result}`, (err, info) => {
                                if (!err) {
                                        global.GoatBot.onReply.set(info.messageID, {
                                                commandName,
                                                messageID: info.messageID,
                                                author: event.senderID,
                                        });
                                }
                        });

                        api.setMessageReaction("🟢", event.messageID, () => {}, true);
                } catch (error) {
                        message.reply('An error occurred.');
                        api.setMessageReaction("🔴", event.messageID, () => {}, true);
                }
        },

        onReply: async function({ api, message, event, Reply, args }) {
                const prompt = args.join(" ");
                const { author, commandName } = Reply;

                if (author !== event.senderID) return; // Check if sender matches

                if (args[0] === 'reset') {
                                const resetUrl = `https://pi.aliestercrowley.com/api/reset?uid=${event.senderID}`;

                                try {
                                                await axios.get(resetUrl);
                                                message.reply("Conversation reset successfully.");
                                } catch (error) {
                                                console.error(error.message);
                                                message.reply("An error occurred while resetting the conversation.");
                                }

                                return;
                }

                api.setMessageReaction("🟡", event.messageID, () => {}, true);

                const url = `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}&username=${event.senderID}`;

                try {
                                const response = await axios.get(url);
                                const content = response.data.response;

                                message.reply(`${content}`, (err, info) => {
                                                if (!err) {
                                                                global.GoatBot.onReply.set(info.messageID, {
                                                                                commandName,
                                                                                messageID: info.messageID,
                                                                                author: event.senderID,
                                                                });
                                                }
                                });

                                api.setMessageReaction("🟢", event.messageID, () => {}, true);
                } catch (error) {
                                console.error(error.message);
                                message.reply("An error occurred.");
                                api.setMessageReaction("🔴", event.messageID, () => {}, true);
                }
        }
};
