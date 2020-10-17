import React from "react";
import { Navigation } from "@shopify/polaris";
import {
  ArrowLeftMinor,
  HomeMajor,
  AddMajor,
  AnalyticsMajor,
  ConversationMinor,
} from "@shopify/polaris-icons";

export default function NavigationMarkup({ toggleModalActive }) {
  return (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: "Back to Shopify",
            icon: ArrowLeftMinor,
          },
        ]}
      />
      <Navigation.Section
        separator
        title="Jaded Pixel App"
        items={[
          {
            label: "Dashboard",
            icon: HomeMajor,
            onClick: () => {},
          },
          {
            label: "Create",
            icon: AddMajor,
            onClick: () => {},
          },
          {
            label: "Analytics",
            icon: AnalyticsMajor,
            onClick: () => {},
          },
        ]}
        action={{
          icon: ConversationMinor,
          accessibilityLabel: "Contact support",
          onClick: toggleModalActive,
        }}
      />
    </Navigation>
  );
}
