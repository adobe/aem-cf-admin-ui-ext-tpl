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
  ProgressCircle,
  Provider,
  Content,
  defaultTheme,
  TextField,
  ButtonGroup,
  Button,
  Heading,
  View
} from '@adobe/react-spectrum'

import allActions from '../config.json'
import actionWebInvoke from '../utils'
import { IllustratedMessage } from '@adobe/react-spectrum'

export default function <%- functionName %> ({ims}) {
  // Fields
  const [slackMessage, setSlackMessage] = useState('')
  const [requestStatus, setRequestStatus] = useState('')
  const [requestMessage, setRequestMessage] = useState('')
  const [guestConnection, setGuestConnection] = useState()
  const { fragmentNames, fragmentTitles } = useParams()

  // Action state
  const [isNotifying, setIsNotifying] = useState(false)
  const [isRequestComplete, setIsRequestComplete] = useState(false)

  
  if (!(fragmentNames || fragmentTitles)) {
    console.error("fragmentNames parameter is missing")
    return
  }

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: "custom-buttons-management" })

      setGuestConnection(guestConnection)
      setSlackMessage(fragmentNames)
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
      allActions['notify-slack'],
      {},
      {
        'userId': ims.profile.userId,
        'slackText': slackMessage + `\n\nSelected Fragment Title(s):\n${fragmentTitles}`
      }
    )

    if (res.error) {
      setRequestStatus("Request Failure")
      setRequestMessage(res.error)
    } else {
      setRequestStatus("Request Success")
      setRequestMessage("The Slack notification was sent successfully.")
      // onCloseHandler()
    }
    setIsRequestComplete(true)
    console.log(res)
    setIsNotifying(false)
  }

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="100%">
        <TextField value={slackMessage} onChange={setSlackMessage} label="Message" width="100%"/>

        <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-400">
          {isNotifying && <ProgressCircle size="S" aria-label="Notifying..." isIndeterminate />}
          <ButtonGroup align="end" margin="size-175">
            <Button variant="primary" onClick={onCloseHandler}>Close</Button>
            <Button variant="cta" onClick={onNotifySlackHandler}>Send</Button>
          </ButtonGroup>
        </Flex>
        <View height="size-300" />
        {isRequestComplete && (
          <IllustratedMessage>
            <Heading>{requestStatus}</Heading>
            <Content>{requestMessage}</Content>
          </IllustratedMessage>
        )}
      </Content>
    </Provider>
  )
}
