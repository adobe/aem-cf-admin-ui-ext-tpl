/*
 * <license header>
 */

import { generatePath } from "react-router";
import { Text } from "@adobe/react-spectrum";
import uixGuest from "@adobe/uix-guest";

function ActionBarButtonIntegrationIframe() {
  const uix = uixGuest({ id: "action-bar-buttons-management" });
  uix.register({
    actionBar: {
      getButton() {
        return [
          <% if (customManifest.actionBarButtons) { -%>
          <% customManifest.actionBarButtons.forEach((button) => { %>
          {
            'id': '<%- button.id %>',
            'label': '<%- button.label %>',
            'icon': ''
          },
          <% })} %>
        ]
      },
      onClick(buttonId, selections) {
        // TODO: issue with limited URL length
        // TODO: hardcoded instance
        <% if (customManifest.actionBarButtons) { -%>
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
        <% }})} %>
      }
    },
  });

  return <Text>IFrame for integration with Host (AEM)...</Text>;
}

export default ActionBarButtonIntegrationIframe;
