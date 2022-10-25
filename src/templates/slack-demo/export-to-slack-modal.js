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
  TextArea,
  ButtonGroup,
  Button,
  Heading,
  View,
  LabeledValue,
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
  const [guestConnection, setGuestConnection] = useState()
  const { fragments } = useParams()

  // Action state
  const [isLoading, setIsLoading] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)
  const [isRequestComplete, setIsRequestComplete] = useState(false)

  
  if (!(fragments)) {
    console.error("Fragments are missing!")
    return
  }

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId })

      setGuestConnection(guestConnection)
      setSlackMessage(fragments)
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
        'slackText': slackMessage
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
            <TextArea value={slackMessage} height="size-2000" isReadOnly/>

            <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-200">
              {isNotifying && <ProgressCircle size="S" aria-label="Notifying..." isIndeterminate />}
              <ButtonGroup marginStart="size-200">
                <Button variant="primary" onClick={onCloseHandler}>Close</Button>
                <Button variant="cta" onClick={onNotifySlackHandler}>Send</Button>
              </ButtonGroup>
            </Flex>
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
