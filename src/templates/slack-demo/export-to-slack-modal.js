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
import { useParams } from "react-router-dom"
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

import allActions from '../config.json'
import actionWebInvoke from '../utils'
import Spinner from "./Spinner"

import { extensionId } from "./Constants"


export default function <%- functionName %> () {
  // Fields
  const [slackMessage, setSlackMessage] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [slackWebhook, setSlackWebhook] = useState('')
  const [slackChannel, setSlackChannel] = useState('')
  const [guestConnection, setGuestConnection] = useState()
  const { fragmentNames, fragmentTitles } = useParams()

  // Action state
  const [isLoading, setIsLoading] = useState(true)
  const [isNotifying, setIsNotifying] = useState(false)
  const [isRequestComplete, setIsRequestComplete] = useState(false)

  
  if (!(fragmentNames || fragmentTitles)) {
    console.error("fragment parameters are missing")
    return
  }

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId })

      setGuestConnection(guestConnection)
      setSlackMessage(fragmentNames)

      const res = await actionWebInvoke(
        allActions['get-slack-config'],
        {},
        {},
        { 'method': 'GET' }
      )
 
      if (res.error) {
        console.log(res.error.message)
      } else {
        setSlackWebhook(res.slackWebhook)
        setSlackChannel(res.slackChannel)
      }
 
      console.log(res)
      setIsLoading(false)
    })()
  }, [])

  const reset = () => {
    setSlackMessage('')
  }

  const onCloseHandler = () => {
    guestConnection.host.modal.close()()
  }

  const onNotifySlackHandler = async () => {
    setIsNotifying(true)

    const res = await actionWebInvoke(
      allActions['export-to-slack'],
      {},
      {
        'slackWebhook': slackWebhook,
        'slackChannel':  slackChannel,
        'slackText': slackMessage + `\n\nSelected Fragment Title(s):\n${fragmentTitles}`
      }
    )

    if (res.error) {
      setStatus("Request Failure")
      setMessage(res.error)
    } else {
      setStatus("Request Success")
      setMessage("The Slack notification was sent successfully.")
    }
    setIsRequestComplete(true)
    console.log(res)
    setIsNotifying(false)
  }

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="100%">
      {
        isLoading ? (
          <Spinner />
        ) : (
          <Form>
            <TextField value={slackMessage} onChange={setSlackMessage} label="Message"/>

            <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-400">
              {isNotifying && <ProgressCircle size="S" aria-label="Notifying..." isIndeterminate />}
              <ButtonGroup marginStart="size-200">
                <Button variant="primary" onClick={onCloseHandler}>Close</Button>
                <Button variant="cta" onClick={onNotifySlackHandler}>Send</Button>
              </ButtonGroup>
            </Flex>
            <View height="size-300" />
            {isRequestComplete && (
              <IllustratedMessage>
                <Heading>{status}</Heading>
                <Content>{message}</Content>
              </IllustratedMessage>
            )}
          </Form>
        )
      }
      </Content>
    </Provider>
  )
}
