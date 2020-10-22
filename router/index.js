import { useContext, useEffect } from "react";
import {
  RoutePropagator as AppBridgeRoutePropagator,
  Context as AppBridgeContext,
} from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import Router, { useRouter } from "next/router";

const RoutePropagator = () => {
  const router = useRouter();
  const { route } = router;
  const appBridge = useContext(AppBridgeContext);

  useEffect(() => {
    appBridge.subscribe(Redirect.ActionType.APP, ({ path }) => {
      Router.push(path);
    });
  }, []);

  return appBridge && route ? (
    <AppBridgeRoutePropagator location={route} app={appBridge} />
  ) : null;
};

export default RoutePropagator;
