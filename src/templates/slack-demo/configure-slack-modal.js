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
 import {
   Flex,
   Form,
   ProgressCircle,
   View,
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
  const [slackWebhook, setSlackWebhook] = useState('')
  const [slackChannel, setSlackChannel] = useState('')
  const [requestStatus, setRequestStatus] = useState('')
  const [requestMessage, setRequestMessage] = useState('')
  const [guestConnection, setGuestConnection] = useState()
  const [sharedContext, setSharedContext] = useState()

  // Action state
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setisDialogOpen] = useState(false)

  useEffect (() => {
    (async () => {
      const guestConnection = await attach({ id: "custom-buttons-management" })

      setGuestConnection(guestConnection)
      setSharedContext(guestConnection.sharedContext)

      const res = await actionWebInvoke(
        allActions['get-slack-config'],
        {},
        { userId: ims.profile.userId },
        { method: 'GET' }
      )

      if (res.error) {
        alert(res.error.message)
      } else {
        setSlackWebhook(res.slackWebhook)
        setSlackChannel(res.slackChannel)
      }

      console.log(res)
      setIsLoading(false)
    })()
  }, [])

  const reset = () => {
    setSlackWebhook('')
    setSlackChannel('')
  }

  const isValidForm = () => {
    slackWebhook & slackChannel
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
          width="50%"
          marginY="size-200"
          onSubmit={async (e) => {
            e.preventDefault()

            setIsSubmitting(true)

            const res = await actionWebInvoke(
              allActions['set-slack-config'],
              {},
              {
                userId: ims.profile.userId,
                slackConfig: {
                  'slackWebhook': slackWebhook,
                  'slackChannel': slackChannel
                }
              }
            )

            if (res.error) {
              setRequestStatus("Request Failure")
              setRequestMessage(res.error)
              setisDialogOpen(true)
            } else {
              setRequestStatus("Request Success")
              setRequestMessage("Slack configuration was saved successfully.")
              setisDialogOpen(true)
            }
            
            console.log(res)
            setIsSubmitting(false)
          }}>
          <TextField value={slackWebhook} onChange={setSlackWebhook} label="Slack Webhook URL"/>
          <TextField value={slackChannel} onChange={setSlackChannel} label="Slack Channel"/>

          <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-400">
            {isSubmitting && <ProgressCircle size="S" aria-label="Submitting..." isIndeterminate />}
            <ButtonGroup align="end" margin="size-175">
              <Button variant="primary" onClick={onCancelHandler}>Cancel</Button>
              <Button variant="cta" type="submit" isDisabled={isSubmitting || isValidForm()}>Save</Button>
            </ButtonGroup>
          </Flex>
        </Form>

        <DialogContainer onDismiss={() => setisDialogOpen(false)}>
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
