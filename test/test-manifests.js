const defaultExtensionManifest = {
  "name": "CF Admin Console Test Extension",
  "id": "cf-admin-console-test-extension",
  "description": "Test Extension for AEM Content Fragment Admin Console",
  "version": "0.0.1"
}

const customExtensionManifest = {
  "name": "CF Admin Console Test Extension",
  "id": "cf-admin-console-test-extension",
  "description": "Test Extension for AEM Content Fragment Admin Console",
  "version": "0.0.1",
  "actionBarButtons": [
    {
      "label": "Export",
      "needsModal": false,
      "id": "export"
    }
  ],
  "headerMenuButtons": [
    {
      "label": "Import",
      "needsModal": true,
      "id": "import"
    }
  ],
  "runtimeActions": [
    {
      "name": "import"
    },
    {
      "name": "export"
    }
  ]
}

const demoExtensionManifest = {
  "name": "Slack Import/Export Extension Demo",
  "id": "slack-import-export-extension-demo",
  "description": "Demo Extension to showcase import/export functionality using custom buttons within AEM Content Fragment Console",
  "version": "1.0.0",
  "templateFolder": "slack-demo",
  "actionBarButtons": [
    {
      "label": "Export to Slack",
      "needsModal": true,
      "id": "export-to-slack"
    }
  ],
  "headerMenuButtons": [
    {
      "label": "Slack Settings",
      "needsModal": true,
      "id": "slack-settings"
    }
  ],
  "runtimeActions": [
    {
      "name": "export-to-slack"
    },
    {
      "name": "get-slack-config"
    },
    {
      "name": "get-slack-channels"
    },
    {
      "name": "import-from-slack"
    },
    {
      "name": "create-new-fragments"
    }
  ],
  "templateInputs": {
    "LOG_LEVEL": "debug",
    "SLACK_WEBHOOK": "$SLACK_WEBHOOK",
    "SLACK_CHANNEL": "$SLACK_CHANNEL",
    "SLACK_OAUTH_TOKEN": "$SLACK_OAUTH_TOKEN"
  },
  "templateDotEnvVars": ["SLACK_WEBHOOK", "SLACK_CHANNEL", "SLACK_OAUTH_TOKEN"]
}

module.exports = {
  defaultExtensionManifest,
  customExtensionManifest,
  demoExtensionManifest
}