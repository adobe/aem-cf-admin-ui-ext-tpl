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

/**
 * This is a sample action showcasing how to send a Slack notification
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const stateLib = require('@adobe/aio-lib-state')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action of generic')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = ['userId', 'slackText']
    const errorMessage = checkMissingRequestInputs(params, requiredParams)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    var paramsData = JSON.parse(JSON.stringify(params))

    const state = await stateLib.init()
    const storedUser = await state.get(`${params.userId}`)
    var slackConfig = {}

    if (storedUser) {
      // exists
      logger.debug(storedUser)
      slackConfig = storedUser.value
    } else {
      // new user
      slackConfig = {
        "slackWebhook": `${params.SLACK_WEBHOOK}`,
        "slackChannel": `${params.SLACK_CHANNEL}`
      }

      await state.put(`${params.userId}`, slackConfig, { ttl: 60 })
    }

    // fetch content from external api endpoint
    var payload = {
      // "channel": `${params.SLACK_CHANNEL}`,
      "channel": slackConfig.slackChannel,
      "username": "incoming-webhook",
      "text": params.slackText,
      "mrkdwn": true
    }
  
    console.log(`${params.SLACK_WEBHOOK}`)
    const res = await fetch(slackConfig.slackWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      // throw new Error('request to ' + `${params.SLACK_WEBHOOK}` + ' failed with status code ' + res.status)
      return errorResponse(res.status, 'Something is wrong with your Slack configuration.', logger)
    }
    // const content = await res.json()
    // const responseObj = JSON.parse(JSON.stringify(content))
    const response = {
      statusCode: 200,
      body: {
        message: "Request Successful!"
      }
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
 