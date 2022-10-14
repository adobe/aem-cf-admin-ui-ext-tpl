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

import React, { useState, useEffect } from 'react'
import { attach } from "@adobe/uix-guest"
import {
  Flex,
  Form,
  ProgressCircle,
  Provider,
  Content,
  defaultTheme,
  TextField,
  ButtonGroup,
  Button,
  Heading,
  View,
  IllustratedMessage,
  StatusLight
} from '@adobe/react-spectrum'

import allActions from '../config.json'
import actionWebInvoke from '../utils'
import Spinner from "./Spinner"

import { extensionId } from "./Constants"


export default function <%- functionName %> () {
  // Fields
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [guestConnection, setGuestConnection] = useState()
  const [foundSlackWebhook, setFoundSlackWebhook] = useState(false)
  const [foundSlackChannel, setFoundSlackChannel] = useState(false)

  // Action state
  const [isLoading, setIsLoading] = useState(true)
  const [isRequestComplete, setIsRequestComplete] = useState(false)

  useEffect (() => {
    (async () => {
      const connection = await attach({ id: extensionId })

      setGuestConnection(connection)

      const res = await actionWebInvoke(
        allActions['get-slack-config'],
        {},
        {},
        { 'method': 'GET' }
      )
 
      if (res.error) {
        console.log(res.error.message)
      } else {
        if (res.slackWebhook !== '') {
          setFoundSlackWebhook(true)
        }

        if (res.slackChannel !== '') {
          setFoundSlackChannel(true)
        }

        setStatus("Set up Slack Configuration")
        setMessage("Please open .env file in your App Builder project and specify your Slack Webhook URL and Channel.")
      }
 
      console.log(res)
      setIsLoading(false)
    })()
  }, [])

  const onCloseHandler = () => {
    guestConnection.host.modal.close()
  }

  const onHelpHandler = () => {
    setStatus("Set up webhook for Slack")
    setMessage("https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack")
    setIsRequestComplete(true)
  }

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="100%">
        {
          isLoading ? (
            <Spinner />
          ) : (
            <Form>
             <StatusLight variant={foundSlackWebhook ? ('positive') : ('negative')}>{foundSlackWebhook ? ("Slack Webhook URL is set up") : ("Slack Webhook URL is not set up")}</StatusLight>
             <StatusLight variant={foundSlackChannel ? ('positive') : ('negative')}>{foundSlackChannel ? ("Slack Channel is set up") : ("Slack Channel is not set up")}</StatusLight>

             <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-400">
               <ButtonGroup marginStart="size-200">
                 <Button variant="primary" onClick={onCloseHandler}>Close</Button>
                 <Button variant="secondary" onClick={onHelpHandler}>Help</Button>
               </ButtonGroup>
             </Flex>
           </Form>
          )
        }
        <View height="size-600" />
        {(isRequestComplete || !foundSlackWebhook || !foundSlackChannel) && (
          <IllustratedMessage>
            <Heading>{status}</Heading>
            <Content>{message}</Content>
          </IllustratedMessage>
        )}
      </Content>
    </Provider>
  )
}
