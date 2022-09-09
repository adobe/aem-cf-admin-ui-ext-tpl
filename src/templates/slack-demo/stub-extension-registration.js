/*
 * <license header> Slack Extension Registration
 */

import { generatePath } from "react-router"
import { Text } from "@adobe/react-spectrum"
import uixGuest from "@adobe/uix-guest"

function ExtensionRegistration() {
  const uix = uixGuest({ id: "buttons-management" })
  uix.register({
    // Your demo code goes here...
    actionBar: {
      getButton() {
        return [
          
        ]
      },
      onClick(buttonId, selections) {
       
      }
    },
    headerMenu: {
      getButton() {
        return [
          
        ]
      },
      onClick(buttonId, selections) {
        
      }
    }
  })

  return <Text>IFrame for integration with Host (AEM)...</Text>
}

export default ExtensionRegistration