/*
 * <license header>
 */

import { generatePath } from "react-router"
import { Text } from "@adobe/react-spectrum"
import uixGuest from "@adobe/uix-guest"

function IntegrationIframe() {
  const uix = uixGuest({ id: "buttons-management" })
  uix.register({
    // Your code goes here...
    <% if (customManifest.actionBarButtons || customManifest.headerMenuButtons) { -%>
    <% if (customManifest.actionBarButtons) { %>
    actionBar: {
      getButton() {
        return [
          <% customManifest.actionBarButtons.forEach((button) => { %>
          {
            'id': '<%- button.id %>',
            'label': '<%- button.label %>',
            'icon': ''
          },
          <% }) %>
        ]
      },
      onClick(buttonId, selections) {
        <% customManifest.actionBarButtons.forEach((button) => { -%>
        <% if (button.needsModal) { %>
        if (buttonId == '<%- button.id %>') {
          const modalURL =
            "https://360030-devx2049-stage.adobeio-static.net/#" +
            generatePath("/content-fragment/:fragmentId/<%- button.id %>-modal", {
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
    <% if (customManifest.headerMenuButtons) { %>
    headerMenu: {
      getButton() {
        return [
          <% customManifest.headerMenuButtons.forEach((button) => { %>
          {
            'id': '<%- button.id %>',
            'label': '<%- button.label %>',
            'icon': ''
          },
          <% }) %>
        ]
      },
      onClick(buttonId, selections) {
        <% customManifest.headerMenuButtons.forEach((button) => { -%>
        <% if (button.needsModal) { %>
        if (buttonId == '<%- button.id %>') {
          const modalURL = "https://360030-devx2049-stage.adobeio-static.net/#/<%- button.id %>-modal"
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

export default IntegrationIframe
