/*jshint esversion: 6 */

const request = require('request');
const fs = require("fs");

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({afk: true})
});

client.on('message', async (msg) => {
	if (msg.isMemberMentioned(client.user) && msg.guild.muted) {
		//must include a direct tag if @everyone is suppressed and there is an @everyone or @here in the message
		if (msg.guild.suppressEveryone && (msg.content.includes("@everyone") || msg.content.includes("@here")) && !msg.content.includes(client.user.id)) {
			return;
		}

		let avatarURL = msg.author.avatarURL
		if (avatarURL == null) {
			avatarURL = msg.author.defaultAvatarURL;
		}

		let content = msg.content;
		let linkAddition = "\n\n" + msg.url;
		content += linkAddition;
		if (content.length > 2000) {
			content = content.substring(0, 2000 - linkAddition.length - 4) + "... " + linkAddition;
		}

		request.post(webHookURL, {
				json: {
					content: content,
					username: msg.author.tag,
					avatar_url: avatarURL
				}
			}, (error, res, body) => {
				if (error) {
					console.error(error)
					return
				}
			}
		);

	}
});

let config = JSON.parse(fs.readFileSync('config.json'));

let webHookURL = config.webHookURL;
//client key
client.login(config.token);