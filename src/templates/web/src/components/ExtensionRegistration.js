/*
 * <license header>
 */

import { generatePath } from "react-router"
import { Text } from "@adobe/react-spectrum"
import uixGuest from "@adobe/uix-guest"

function ExtensionRegistration() {
  const uix = uixGuest({ id: "buttons-management" })
  uix.register({
    // Your code goes here...
    <% if (extensionManifest.actionBarButtons || extensionManifest.headerMenuButtons) { -%>
      <% if (extensionManifest.actionBarButtons) { %>
    actionBar: {
      getButton() {
        return [
          <% extensionManifest.actionBarButtons.forEach((button) => { %>
          {
            'id': '<%- button.id %>',
            'label': '<%- button.label %>',
            'icon': ''
          },
          <% }) %>
        ]
      },
      onClick(buttonId, selections) {
        <% extensionManifest.actionBarButtons.forEach((button) => { -%>
          <% if (button.needsModal) { %>
        if (buttonId == '<%- button.id %>') {
          const modalURL = "/#" + generatePath("/content-fragment/:fragmentId/<%- button.id %>-modal", {
              fragmentId: encodeURIComponent(selections[0].id),
            });
          console.log("Modal URL: ", modalURL);
          
          uix.host.actionBar.showModal({
            title: "<%- button.label %> the Content Fragments",
            url: modalURL
          })
        }
        <% }}) %>
      }
    },
    <% } %>
    <% if (extensionManifest.headerMenuButtons) { %>
    headerMenu: {
      getButton() {
        return [
          <% extensionManifest.headerMenuButtons.forEach((button) => { %>
          {
            'id': '<%- button.id %>',
            'label': '<%- button.label %>',
            'icon': ''
          },
          <% }) %>
        ]
      },
      onClick(buttonId, selections) {
        <% extensionManifest.headerMenuButtons.forEach((button) => { -%>
          <% if (button.needsModal) { %>
        if (buttonId == '<%- button.id %>') {
          const modalURL = "/#/<%- button.id %>-modal"
          console.log("Modal URL: ", modalURL);
          
          uix.host.headerMenu.showModal({
            title: "<%- button.label %>",
            url: modalURL
          })
        }
        <% }}) %>
      }
    }
    <% }} %>
  })

  return <Text>IFrame for integration with Host (AEM)...</Text>
}

export default ExtensionRegistration
