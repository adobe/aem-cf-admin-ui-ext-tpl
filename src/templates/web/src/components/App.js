/*
 * <license header>
 */

import React from "react"
import ErrorBoundary from "react-error-boundary"

import { HashRouter as Router, Routes, Route } from "react-router-dom"

import ExtensionRegistration from "./ExtensionRegistration"
<%# "Add import statements for modals" -%>
<% const actionBarButtons = extensionManifest.actionBarButtons || [] -%>
<% const headerMenuButtons = extensionManifest.headerMenuButtons || [] -%>
<% const allCustomButtons = actionBarButtons.concat(headerMenuButtons) -%>
  <% allCustomButtons.forEach((button) => { -%>
    <% if (button.needsModal) { -%>
      <% const modalFileName = button.label.replace(/ /g, '') + 'Modal' %>
import <%- modalFileName %> from "./<%- modalFileName %>"
<% }}) -%>

function App() {
  return (
    <Router>
      <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
        <Routes>
          <Route path="/">
            <Route index element={<ExtensionRegistration />} />
            
            <Route
              exact path="index.html"
              element={<ExtensionRegistration />} 
            />
            <% if (extensionManifest.actionBarButtons) { -%>
              <% extensionManifest.actionBarButtons.forEach((button) => { -%>
                <% if (button.needsModal) { %>
            <Route
              exact path="content-fragment/:fragmentId/<%- button.id %>-modal"
              element={<<%- button.label.replace(' ', '') %>Modal />}
            />
            <% }})} -%>
            <% if (extensionManifest.headerMenuButtons) { -%>
              <% extensionManifest.headerMenuButtons.forEach((button) => { -%>
                <% if (button.needsModal) { %>
            <Route
              exact path="<%- button.id %>-modal"
              element={<<%- button.label.replace(' ', '') %>Modal />}
            />
            <% }})} %>
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  )

  // Methods

  // error handler on UI rendering failure
  function onError(e, componentStack) {}

  // component to show if UI fails rendering
  function fallbackComponent({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: "center", marginTop: "20px" }}>
          Phly, phly... Something went wrong :(
        </h1>
        <pre>{componentStack + "\n" + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
