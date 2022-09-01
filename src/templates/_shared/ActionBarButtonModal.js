/*
 * <license header>
 */

import React, { useEffect, useState } from "react";
import {
  Provider,
  defaultTheme,
  Flex,
  ProgressCircle,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Content,
  Form,
} from "@adobe/react-spectrum";
import { Item, ListView } from "@react-spectrum/list";
import actionWebInvoke from "../utils";
import actions from "../config.json";
import { useParams } from "react-router-dom";
import { connectToParent } from "penpal";
import { StatusLight } from "@adobe/react-spectrum";
import { readDestination } from "yeoman-generator/lib/actions/fs";

function <%- functionName %> () {
  const [isLoading, setIsLoading] = useState(true);
  // TODO: process if fragmentId is undefined
  const { fragmentId } = useParams();

  const [api, setApi] = useState(undefined);
  const [authConfig, setAuthConfig] = useState(undefined);
  useEffect(() => {
    const { promise } = connectToParent();
    promise.then(
        async (api) => {
          const apiAuthConfig = await api.getAuthConfig();
          setAuthConfig(apiAuthConfig);
          setApi(api);
        }
    );
  }, [api, authConfig]);

  return (
    <Provider theme={defaultTheme} colorScheme={`light`}>
      <Content width="97%">
        {isLoading ? (
          <Flex alignItems="center" justifyContent="center" height="50vh">
            <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
          </Flex>
        ) : translations.length ? (
          <Form necessityIndicator="label" onSubmit={onQuickPublishHandler}>
            <ListView
              selectionMode="multiple"
              aria-label="Static ListView items example"
              margin="size-175"
              onSelectionChange={onSelectionChangeHandler}
            >
              {translations.map((translation) => {
                return (
                  <Item key={translation.path} textValue={translation.path}>
                    <Text>
                      {translation.code} ({translation.title})
                    </Text>
                    <Text slot="description">{translation.updated}</Text>
                    <StatusLight
                      variant={statusLightVariant[translation.status]}
                      justifySelf="end"
                      right="size-15"
                      position="absolute"
                    >
                      {translation.status
                        .toLowerCase()
                        .charAt(0)
                        .toUpperCase() +
                        translation.status.toLowerCase().slice(1)}
                    </StatusLight>
                  </Item>
                );
              })}
            </ListView>
            <ButtonGroup align="end" margin="size-175">
              <Button variant="secondary" onPress={() => api.closeModal()}>
                Cancel
              </Button>
              <Button
                variant="cta"
                type="submit"
                isDisabled={publishingIsDisabled}
              >
                Publish
              </Button>
              <Button
                variant="cta"
                type="button"
                isDisabled={publishingIsDisabled}
                onClick={onUnpublishHandler}
              >
                Unpublish
              </Button>
            </ButtonGroup>
          </Form>
        ) : (
          <>
            <Heading level={3}>There are no translations</Heading>
            <Button variant="secondary" onPress={() => api.closeModal()}>Cancel</Button>
          </>
        )}
      </Content>
    </Provider>
  );
}

export default <%- functionName %>
