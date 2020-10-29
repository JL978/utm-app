import React from "react";
import { Navigation } from "@shopify/polaris";
import {
  ArrowLeftMinor,
  HomeMajor,
  AddMajor,
  AnalyticsMajor,
  ConversationMinor,
  AddProductMajor,
  CollectionsMajor,
} from "@shopify/polaris-icons";
import { useRouter } from "next/router";

export default function NavigationMarkup({ toggleModalActive }) {
  const router = useRouter();

  return (
    <Navigation location="/">
      <Navigation.Section
        title="Jaded Pixel App"
        items={[
          {
            label: "Dashboard",
            icon: HomeMajor,
            onClick: () => router.push("/"),
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
      <Navigation.Section
        separator
        title="Create links"
        items={[
          {
            label: "Product",
            icon: AddProductMajor,
            onClick: () => router.push("/product_link"),
          },
          {
            label: "Collection",
            icon: CollectionsMajor,
            onClick: () => router.push("/collection_link"),
          },
        ]}
      />
    </Navigation>
  );
}
