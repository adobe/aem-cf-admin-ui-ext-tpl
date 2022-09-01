/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import uixGuest from "@adobe/uix-guest";

function HeaderButtonIntegrationIframe() {
  const uix = uixGuest({ id: "header-menu-buttons-management" });
  uix.register({
    headerMenu: {
      getButton() {
        return [
          <% if (customManifest.headerMenuButtons) { -%>
          <% customManifest.headerMenuButtons.forEach((button) => { %>
          {
            'id': '<%- button.id %>',
            'label': '<%- button.label %>',
            'icon': ''
          },
          <% })} %>
        ]
      },
      onClick(buttonId) {
        // TODO: issue with limited URL length
        // TODO: hardcoded instance
        <% if (customManifest.headerMenuButtons) { -%>
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
        <% }})} %>
      }
    },
  });

  return <Text>IFrame for integration with Host (AEM)...</Text>;
}

export default HeaderButtonIntegrationIframe;
