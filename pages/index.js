import { useState, useRef, useCallback } from "react";
import { Frame, Toast } from "@shopify/polaris";

import TopBarMarkup from "../components/TopBar";
import NavigationMarkup from "../components/Navigation";
import DashMarkup from "../components/Dashboard";
import ModalMarkup from "../components/Modal";

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

  const dashMarkup = <DashMarkup />;

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
      {dashMarkup}
      {toastMarkup}
      {modalMarkup}
    </Frame>
  );
}

export default Index;
