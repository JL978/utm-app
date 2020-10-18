import React from "react";
import { Navigation } from "@shopify/polaris";
import {
  ArrowLeftMinor,
  HomeMajor,
  AddMajor,
  AnalyticsMajor,
  ConversationMinor,
} from "@shopify/polaris-icons";
import { useRouter } from "next/router";

export default function NavigationMarkup({ toggleModalActive }) {
  const router = useRouter();

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
            onClick: () => router.push("/"),
          },
          {
            label: "Create",
            icon: AddMajor,
            onClick: () => router.push("/add"),
          },
          {
            label: "Analytics",
            icon: AnalyticsMajor,
            onClick: () => router.push("/"),
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
