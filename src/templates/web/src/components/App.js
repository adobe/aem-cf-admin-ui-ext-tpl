/*
 * <license header>
 */

import React from "react"
import ErrorBoundary from "react-error-boundary"

import { HashRouter as Router, Routes, Route } from "react-router-dom"

import IntegrationIframe from "./IntegrationIframe"
<%# "Add import statements for modals" -%>
<% if (customManifest.actionBarButtons) { -%>
<% customManifest.actionBarButtons.forEach((button) => { -%>
<% if (button.needsModal) { %>
import <%- button.label.replace(' ', '') %>Modal from "./<%- button.label.replace(' ', '') %>Modal"
<% }})} -%>
<% if (customManifest.headerMenuButtons) { -%>
<% customManifest.headerMenuButtons.forEach((button) => { -%>
<% if (button.needsModal) { %>
import <%- button.label.replace(' ', '') %>Modal from "./<%- button.label.replace(' ', '') %>Modal"
<% }})} -%>

function App() {
  // TODO: add NoFoundPage component
  return (
    <Router>
      <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
        <Routes>
          <Route path="/">
            <Route index element={< IntegrationIframe />} />
            
            <Route
              path="index.html"
              element={< IntegrationIframe />} 
            />
            <% if (customManifest.actionBarButtons) { -%>
            <% customManifest.actionBarButtons.forEach((button) => { -%>
            <% if (button.needsModal) { %>
            <Route
              path="content-fragment/:fragmentId/<%- button.id %>-modal"
              element={< <%- button.label.replace(' ', '') %>Modal />}
            />
            <% }})} -%>
            <% if (customManifest.headerMenuButtons) { -%>
            <% customManifest.headerMenuButtons.forEach((button) => { -%>
            <% if (button.needsModal) { %>
            <Route
              path="<%- button.id %>-modal"
              element={< <%- button.label.replace(' ', '') %>Modal />}
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
