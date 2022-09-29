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
  View
} from '@adobe/react-spectrum'

import Spinner from "./Spinner"
import { IllustratedMessage } from '@adobe/react-spectrum'

import allActions from '../config.json'
import actionWebInvoke from '../utils'


export default function <%- functionName %> ({ims}) {
 // Fields
 const [slackWebhook, setSlackWebhook] = useState('')
 const [slackChannel, setSlackChannel] = useState('')
 const [requestStatus, setRequestStatus] = useState('')
 const [requestMessage, setRequestMessage] = useState('')
 const [guestConnection, setGuestConnection] = useState()

 // Action state
 const [isLoading, setIsLoading] = useState(true)
 const [isSaving, setIsSaving] = useState(false)
 const [isRequestComplete, setIsRequestComplete] = useState(false)

 useEffect (() => {
   (async () => {
     const guestConnection = await attach({ id: "custom-buttons-management" })

     setGuestConnection(guestConnection)

     const res = await actionWebInvoke(
       allActions['get-slack-config'],
       {},
       { 'userId': ims.profile.userId },
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
   setSlackWebhook('')
   setSlackChannel('')
 }

 const isValidForm = () => {
   slackWebhook & slackChannel
 }

 const onCloseHandler = () => {
   guestConnection.host.modal.close()
 }

 const onHelpHandler = () => {
   setRequestStatus("Set up webhook for Slack")
   setRequestMessage("https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack")
   setIsRequestComplete(true)
 }

 const onSaveHandler = async () => {
   setIsSaving(true)

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
     } else {
       setRequestStatus("Request Success")
       setRequestMessage("Slack configuration was saved successfully.")
       // onCloseHandler()
     }
     setIsRequestComplete(true)
     console.log(res)
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
               <ButtonGroup marginStart="size-200">
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
           <Heading>{requestStatus}</Heading>
           <Content>{requestMessage}</Content>
         </IllustratedMessage>
       )}
     </Content>
   </Provider>
 )
}
