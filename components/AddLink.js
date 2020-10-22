import React, { useState, useCallback, useEffect } from "react";
import {
  ContextualSaveBar,
  Layout,
  FormLayout,
  Card,
  TextField,
  Page,
  Button,
  Toast,
  Thumbnail,
  ResourceList,
  ResourceItem,
  TextStyle,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useRouter } from "next/router";
import { useLazyQuery, gql } from "@apollo/client";

const GET_LINK = gql`
  query getLink($id: ID!) {
    product(id: $id) {
      onlineStorePreviewUrl
    }
  }
`;

const slugMap = new Map();
slugMap
  .set("source", "utm_source")
  .set("medium", "utm_medium")
  .set("campaign", "utm_campaign")
  .set("term", "utm_term")
  .set("content", "utm_content");

export default function AddLink() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const [source, setSource] = useState({ input: "", term: "source" });
  const [medium, setMedium] = useState({ input: "", term: "medium" });
  const [campaign, setCampaign] = useState({ input: "", term: "campaign" });
  const [content, setContent] = useState({ input: "", term: "content" });
  const [term, setTerm] = useState({ input: "", term: "term" });

  const [link, setLink] = useState("");
  const [params, setParams] = useState("");
  const [productInfo, setProductInfo] = useState(null);

  const [id, setId] = useState("");
  const [getLink, { loading, error, data }] = useLazyQuery(GET_LINK, {
    variables: {
      id: id,
    },
  });

  useEffect(() => {
    if (id !== "") {
      getLink();
    }
  }, [id]);

  useEffect(() => {
    if (data !== undefined && !error) {
      const url = data.product.onlineStorePreviewUrl;
      setLink(url);
    }
  }, [data]);

  useEffect(() => {
    const inputData = [source, medium, campaign, content, term];
    let params = "?";
    const outputData = [];
    for (const data of inputData) {
      if (data.input != "") {
        const query = slugMap.get(data.term) + "=" + data.input;
        outputData.push(query);
      }
    }
    for (const [index, param] of outputData.entries()) {
      const length = outputData.length;
      if (index + 1 !== length) {
        params += param + "&";
      } else {
        params += param;
      }
    }
    setParams(params);
  }, [source, medium, campaign, content, term]);

  const copyToClipboard = () => {
    const inputField = document.getElementById("PolarisTextField6");

    console.log(inputField);

    inputField.select();
    inputField.setSelectionRange(0, 99999); /*For mobile devices*/

    document.execCommand("copy");
  };

  const toggleToast = useCallback(() => setToastOpen((active) => !active), []);

  const toastMarkup = toastOpen ? (
    <Toast content="Copied to clipboard" onDismiss={toggleToast} />
  ) : null;

  return (
    <>
      <Page
        breadcrumbs={[{ content: "Home", url: "/" }]}
        title="Create a link"
        primaryAction={
          <Button loading={loading} primary onClick={() => setOpen(true)}>
            {link === "" ? "Pick a product to start" : "Choose another product"}
          </Button>
        }
      >
        <ContextualSaveBar
          message="Unsaved changes"
          saveAction={{
            onAction: () => console.log("add form submit logic"),
            loading: false,
            disabled: false,
          }}
          discardAction={{
            onAction: () => router.push("/"),
          }}
        />

        <Layout>
          <Layout.AnnotatedSection
            title="Link Setting"
            description="Customize your tracking link"
          >
            <Card sectioned>
              <FormLayout>
                <TextField
                  label="Source"
                  value={source.input}
                  onChange={(value) =>
                    setSource((data) => ({ ...data, input: value }))
                  }
                />
                <TextField
                  label="Medium"
                  value={medium.input}
                  onChange={(value) =>
                    setMedium((data) => ({ ...data, input: value }))
                  }
                />
                <TextField
                  label="Campaign Name"
                  value={campaign.input}
                  onChange={(value) =>
                    setCampaign((data) => ({ ...data, input: value }))
                  }
                />
                <TextField
                  label="Content"
                  value={content.input}
                  onChange={(value) =>
                    setContent((data) => ({ ...data, input: value }))
                  }
                />
                <TextField
                  label="Keyword"
                  value={term.input}
                  onChange={(value) =>
                    setTerm((data) => ({ ...data, input: value }))
                  }
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Link Preview"
            description="Share this link with your customers on the appropriate channels to enable tracking"
          >
            <Card sectioned>
              <FormLayout>
                <TextField
                  label="Source"
                  value={link !== "" && link + params}
                  multiline={true}
                />
                <Button
                  disabled={link === ""}
                  onClick={() => {
                    copyToClipboard();
                    toggleToast();
                  }}
                >
                  Copy to clipboard
                </Button>
              </FormLayout>
            </Card>
            <Card>
              {productInfo ? (
                <ResourceItem
                  media={
                    <Thumbnail
                      source={productInfo.images[0].originalSrc}
                      alt={productInfo.handle}
                    />
                  }
                >
                  <h1>
                    <TextStyle variation="strong">
                      {productInfo.title}
                    </TextStyle>
                  </h1>
                  <p>{productInfo.descriptionHtml}</p>
                </ResourceItem>
              ) : (
                <h1 style={{ textAlign: "center" }}>
                  <TextStyle variation="strong">
                    No Product To Preview
                  </TextStyle>
                </h1>
              )}
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
        {toastMarkup}
      </Page>
      <ResourcePicker
        open={open}
        resourceType="Product"
        showVariants={false}
        onCancel={() => setOpen(false)}
        onSelection={(choice) => {
          const product = choice.selection[0];
          const { id, title, handle, images, descriptionHtml } = product;
          console.log(product);
          setId(id);
          setProductInfo({ title, handle, images, descriptionHtml });
          setOpen(false);
        }}
      />
    </>
  );
}
