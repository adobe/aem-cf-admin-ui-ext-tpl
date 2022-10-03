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
  IllustratedMessage
} from '@adobe/react-spectrum'

import Spinner from "./Spinner"
import { extensionId } from "./Constants"


export default function <%- functionName %> () {
  // Fields
  const [slackWebhook, setSlackWebhook] = useState('')
  const [slackChannel, setSlackChannel] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [guestConnection, setGuestConnection] = useState()

  // Action state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRequestComplete, setIsRequestComplete] = useState(false)

  useEffect (() => {
    (async () => {
      const connection = await attach({ id: extensionId })

      setGuestConnection(connection)

      try {
      const webhook = localStorage.getItem('slackWebhook')
      const channel = localStorage.getItem('slackChannel')
      setSlackWebhook(webhook)
      setSlackChannel(channel)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
    })()
  }, [])

  const reset = () => {
    setSlackWebhook('')
    setSlackChannel('')
  }

  const onCloseHandler = () => {
    guestConnection.host.modal.close()
  }

  const onHelpHandler = () => {
    setStatus("Set up webhook for Slack")
    setMessage("https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack")
    setIsRequestComplete(true)
  }

  const onSaveHandler = async () => {
  setIsSaving(true)

  try {
    localStorage.setItem('slackWebhook', slackWebhook)
    localStorage.setItem('slackChannel', slackChannel)
    setStatus("Success")
    setMessage("Slack configuration was saved successfully.")
  } catch (error) {
    console.log(error)
    setStatus("Failure")
    setMessage(error)
  }

  setIsRequestComplete(true)
  setIsSaving(false)
  }

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="100%">
        {
          isLoading ? (
            <Spinner />
          ) : (
            <Form isRequired isDisabled={isSaving}>
              <TextField value={slackWebhook} onChange={setSlackWebhook} label="Slack Webhook URL"/>
              <TextField value={slackChannel} onChange={setSlackChannel} label="Slack Channel"/>

              <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-400">
                {isSaving && <ProgressCircle size="S" aria-label="Saving..." isIndeterminate />}
                <ButtonGroup align="end">
                  <Button variant="primary" onClick={onCloseHandler}>Close</Button>
                  <Button variant="secondary" onClick={onHelpHandler}>Help</Button>
                  <Button variant="cta" onClick={onSaveHandler}>Save</Button>
                </ButtonGroup>
              </Flex>
            </Form>
          )
        }
        <View height="size-300" />
        {isRequestComplete && (
          <IllustratedMessage>
            <Heading>{status}</Heading>
            <Content>{message}</Content>
          </IllustratedMessage>
        )}
      </Content>
    </Provider>
  )
}
