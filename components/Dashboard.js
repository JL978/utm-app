import React from "react";
import { Page, Card, Layout, DataTable, Heading } from "@shopify/polaris";

export default function DashBoard() {
  const rows = [
    ["Emerald Silk Gown", "$875.00", 124689, 140, "$122,500.00"],
    ["Mauve Cashmere Scarf", "$230.00", 124533, 83, "$19,090.00"],
    [
      "Navy Merino Wool Blazer with khaki chinos and yellow belt",
      "$445.00",
      124518,
      32,
      "$14,240.00",
    ],
  ];

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <Heading element="h1">All links</Heading>
          <Card sectioned>
            <DataTable
              columnContentTypes={[
                "text",
                "numeric",
                "numeric",
                "numeric",
                "numeric",
              ]}
              headings={["Title", "Link", "Type", "Discount Code", "Actions"]}
              rows={rows}
              truncate={true}
            />
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card
            title="Total Revenue"
            actions={[{ content: "See more" }]}
          ></Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card title="Top Channels" actions={[{ content: "See more" }]}></Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
