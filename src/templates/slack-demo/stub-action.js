/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const request = require('request')

/**
 * This is a sample action for how to receive event and sent a message to Slack.
 * Add your Slack Webhook/Channel here.
 * Replace the code below to change the Slack sample action (<%= actionName %>)
 * Setup Slack Webhook: https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack
*/

async function main (params) {
  
  /* Print event detail */
  console.log('in main + event detail: ', params.event)

  var returnObject = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: ""
  }

  /* Handle the challenge */
  if (params.challenge) {

    console.log('Returning challenge: ' + params.challenge)

    returnObject.body = new Buffer(JSON.stringify({
      "challenge": params.challenge
    })).toString('base64')

    return returnObject

  } else {
    /* We need it to run asynchronously, so we are returning a Promise */
    return new Promise(function (resolve, reject) {

      // var slackMessage = " Event received: " + JSON.stringify(params)
      var paramsData = JSON.parse(JSON.stringify(params))
      var slackMessage = ""

      if (paramsData.type == "com.adobe.commerce.product.created") {
        slackMessage = "PRODUCT CREATED!"
      } else if (paramsData.type == "com.adobe.commerce.product.updated") {
        slackMessage = "PRODUCT UPDATED!"
      }
      
      var payload = {
        "channel": `${params.SLACK_CHANNEL}`,
        "username": "incoming-webhook",
        "text": slackMessage,
        "mrkdwn": true,
      }

      var options = {
        method: 'POST',
        url: `${params.SLACK_WEBHOOK}`,
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      }

      request(options, function (error, response, body) {
        if (error) {
          console.log("ERROR: fail to post " + response)
          reject(error)
        } else {
          console.log ("SUCCESS: posted to slack " + slackMessage)
          returnObject.body = new Buffer(JSON.stringify({
            "slackMessage": slackMessage
          })).toString('base64')

          resolve(returnObject)
        }
      })
    })
  }
}

exports.main = main
