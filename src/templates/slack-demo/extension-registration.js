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

import { generatePath } from "react-router"
import { Text } from "@adobe/react-spectrum"
import { register } from "@adobe/uix-guest"

import { extensionId } from "./Constants"

function ExtensionRegistration() {
  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      methods: {
        actionBar: {
          getButton() {
            return {
              id: 'notify-slack',
              label: 'Notify Slack',
              icon: 'PublishCheck'
            }
          },
          
          onClick(selections) {
            var selectionNames = ""
            var selectionTitles = ""
    
            selections.forEach((selection) => {
              selectionNames = selectionNames.concat(selection.name, ' | ')
              selectionTitles = selectionTitles.concat(selection.title, '\n')
            })
            console.log("Selection Names: ", selectionNames)
            console.log("Selection Titles: ", selectionTitles)
    
            const modalURL = "/index.html#" + generatePath("/content-fragment/:fragmentNames/:fragmentTitles/notify-slack-modal", {
              fragmentNames: encodeURIComponent(selectionNames),
              fragmentTitles: encodeURIComponent(selectionTitles)
            })
            console.log("Modal URL: ", modalURL)
    
            guestConnection.host.modal.showUrl({
              title: 'Notify Slack',
              url: modalURL
            })
          }
        },
        headerMenu: {
          getButton() {
            return {
              id: 'configure-slack',
              label: 'Configure Slack',
              icon: 'OpenIn'
            }
          },
          onClick() {
            const modalURL = "/index.html#/configure-slack-modal"
            console.log("Modal URL: ", modalURL)
    
            guestConnection.host.modal.showUrl({
              title: 'Configure Slack',
              url: modalURL
            })
          }
        }
      }
    })
  }
  init().catch(console.error)

  return <Text>IFrame for integration with Host (AEM)...</Text>
}

export default ExtensionRegistration