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

import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import { attach } from "@adobe/uix-guest"
import {
  Flex,
  Form,
  ProgressCircle,
  Provider,
  defaultTheme,
  TextField,
  ButtonGroup,
  Button,
  AlertDialog,
  DialogContainer
} from '@adobe/react-spectrum'

import allActions from '../config.json'
import actionWebInvoke from '../utils'

export default <%- functionName %> () {
  // Fields
  const [slackText, setSlackText] = useState('')
  const [requestStatus, setRequestStatus] = useState('')
  const [requestMessage, setRequestMessage] = useState('')
  const [guestConnection, setGuestConnection] = useState()
  const [sharedContext, setSharedContext] = useState()
  const fragmentId = useParams()

  // Action state
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  
  if (!fragmentId) {
    console.error("fragmentId parameter is missing")
    return
  }

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: "custom-buttons-management" })

      setGuestConnection(guestConnection)
      setSharedContext(guestConnection.sharedContext)
      setIsLoading(false)
    })()
  }, [])

  const reset = () => {
    setSlackText('')
  }

  const isValidForm = () => {
    slackText
  }

  const onCancelHandler = () => {
    guestConnection.modal.closeModal()
  }

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="97%">
        <Form
          isRequired
          isDisabled={isSubmitting}
          width="size-6000"
          marginY="size-200"
          onSubmit={async (e) => {
            e.preventDefault()

            setIsSubmitting(true)

            const res = await actionWebInvoke(
              allActions['notify-slack'],
              {},
              {
                'userId': ims.profile.userId,
                'slackText': slackText
              }
            )

            if (res.error) {
              setRequestStatus("Request Failure")
              setRequestMessage(res.error)
              setIsDialogOpen(true)
            } else {
              setRequestStatus("Request Success")
              setRequestMessage("The Slack notification was sent successfully.")
              setIsDialogOpen(true)
              reset()
            }
            
            console.log(res)
            setIsSubmitting(false)
          }}>
          <TextField value={slackText} onChange={setSlackText} label="Slack Text"/>

          <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-400">
            {isSubmitting && <ProgressCircle size="S" aria-label="Submitting..." isIndeterminate />}
            <ButtonGroup align="end" margin="size-175">
              <Button variant="primary" onClick={onCancelHandler}>Cancel</Button>
              <Button variant="cta" type="submit" isDisabled={isSubmitting || isValidForm()}>Send</Button>
            </ButtonGroup>
          </Flex>
        </Form>

        <DialogContainer onDismiss={() => setIsDialogOpen(false)}>
          {isDialogOpen && (
            <AlertDialog title={requestStatus} variant="information" primaryActionLabel="Close">
              {requestMessage}
            </AlertDialog>
          )}
        </DialogContainer>
      </Content>
    </Provider>
  )
}
