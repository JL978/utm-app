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

export default function AddLink() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const [source, setSource] = useState({ input: "", param: "utm_source" });
  const [medium, setMedium] = useState({ input: "", param: "utm_medium" });
  const [campaign, setCampaign] = useState({
    input: "",
    param: "utm_campaign",
  });
  const [content, setContent] = useState({ input: "", param: "utm_content" });
  const [term, setTerm] = useState({ input: "", param: "utm_term" });

  const [link, setLink] = useState("");
  const [params, setParams] = useState("");
  const [productInfo, setProductInfo] = useState(null);

  const [id, setId] = useState("");
  const [getLink, { loading, error, data }] = useLazyQuery(GET_LINK, {
    variables: {
      id: id,
    },
  });

  //When ID is updated, make a new query
  useEffect(() => {
    if (id !== "") {
      getLink();
    }
  }, [id]);

  //When data changes due to query, set url
  useEffect(() => {
    if (data !== undefined && !error) {
      const url = data.product.onlineStorePreviewUrl;
      setLink(url);
    } else {
      console.log(error);
    }
  }, [data]);

  //When user typing into one of the text field, update the query params
  useEffect(() => {
    const inputData = [source, medium, campaign, content, term];
    let params = "?";
    const outputData = [];
    for (const data of inputData) {
      if (data.input != "") {
        const query = data.param + "=" + data.input;
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
    const inputField = document.getElementById("copy_link");

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
            onAction: () => {},
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
                <Button primary onClick={() => setOtherOpen(true)}>
                  Test
                </Button>
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
                  id="copy_link"
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
                <a
                  href={link}
                  target="_blank"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
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
                </a>
              ) : (
                <h1 style={{ textAlign: "center", padding: "10px 0" }}>
                  <TextStyle variation="subdued">
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
          setId(id);
          setProductInfo({ title, handle, images, descriptionHtml });
          setOpen(false);
        }}
      />
      <ResourcePicker
        open={otherOpen}
        resourceType="Collection"
        showVariants={false}
        onCancel={() => setOtherOpen(false)}
        onSelection={(choice) => {
          console.log(choice);
          // const product = choice.selection[0];
          // const { id, title, handle, images, descriptionHtml } = product;
          // setId(id);
          // setProductInfo({ title, handle, images, descriptionHtml });
          // setOpen(false);
        }}
      />
    </>
  );
}
