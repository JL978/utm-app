import { useState, useRef, useCallback } from "react";
import { Frame, Toast } from "@shopify/polaris";

import TopBarMarkup from "../components/TopBar";
import NavigationMarkup from "../components/Navigation";
import DashMarkup from "../components/Dashboard";
import ModalMarkup from "../components/Modal";
import AddLink from "../components/AddLink";
import { Switch, Route, StaticRouter as Router } from "react-router-dom";

function Index() {
  const defaultState = useRef({
    emailFieldValue: "dharma@jadedpixel.com",
    nameFieldValue: "Jaded Pixel",
  });
  const skipToContentRef = useRef(null);

  const [toastActive, setToastActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleToastActive = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    []
  );

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const toggleModalActive = useCallback(
    () => setModalActive((modalActive) => !modalActive),
    []
  );

  const topBarMarkup = (
    <TopBarMarkup
      defaultState={defaultState}
      toggleMobileNavigationActive={toggleMobileNavigationActive}
    />
  );

  const toastMarkup = toastActive ? (
    <Toast onDismiss={toggleToastActive} content="Changes saved" />
  ) : null;

  const navigationMarkup = (
    <NavigationMarkup toggleModalActive={toggleModalActive} />
  );

  const modalMarkup = (
    <ModalMarkup
      toggleModalActive={toggleModalActive}
      modalActive={modalActive}
    />
  );

  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef.current}
    >
      <Switch>
        <Route exact path="/">
          <DashMarkup />
        </Route>
        <Route path="/add">
          <AddLink />
        </Route>
      </Switch>

      {toastMarkup}
      {modalMarkup}
    </Frame>
  );
}

export default Index;
