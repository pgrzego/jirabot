'use strict'

const _ = require('lodash')
const config = require('../src/config')
const Botkit = require('botkit')

class Notifier {

	constructor() {
		this.msgDefaults = {
		  response_type: 'in_channel',
		  //username: 'Jirabot',
		  //icon_emoji: config('ICON_EMOJI')
		}

		this.controller = Botkit.slackbot({})
		this.bot = this.controller.spawn()

		this.bot.configureIncomingWebhook({ url: config('WEBHOOK_URL') })
	}

	parseRequest(request) {
		switch (request.webhookEvent) {
			case "comment_created": 
				console.log("Comment has been created.")
				this.newComment(request)
				break
			case "jira:issue_updated": 
				console.log("Issue has been updated.")
				break
			default: 
				console.log("Unknown webhook event.")
		}
	}

	postMsg(attachments) {
		let msg = _.defaults({ attachments: attachments }, this.msgDefaults)
		this.bot.sendWebhook(msg, (err, res) => {
		    if (err) throw err
		    console.log(`Notification delivered`)
		})
	}

	newComment(request) {
		this.postMsg([{
			"fallback": "There is a new comment added by "+request.author.displayName,
            "color": "#205081",
            "pretext": "New comment on Jira",
            "author_name": request.comment.author.displayName,
            "author_link": request.comment.author.self,
            "author_icon": request.comment.author.avatarUrls["48x48"],
            "title": "Click to respond",
            "title_link": request.comment.self,
            "text": request.comment.body.substring(0,50),
            "ts": request.timestamp
		}])
	}

}

module.exports = Notifier