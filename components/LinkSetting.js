import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from "react";
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

import { useRouter } from "next/router";
import { useLazyQuery, gql } from "@apollo/client";
import { OriginContext } from "../Context";
import axios from "axios";

const GET_PRODUCT_LINK = gql`
  query getLink($id: ID!) {
    product(id: $id) {
      onlineStorePreviewUrl
    }
  }
`;

const GET_COLLECTION_HANDLE = gql`
  query getLink($id: ID!) {
    collection(id: $id) {
      handle
    }
  }
`;

export default function LinkSetting({ productInfo, id, setPickerOpen, type }) {
  const router = useRouter();
  const [toastOpen, setToastOpen] = useState(false);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const shopOrigin = useContext(OriginContext);

  const [params, setParams] = useState([
    {
      name: "source",
      input: "",
      label: "Source*",
      param: "utm_source",
      error: "",
      helpText: "The referrer: (e.g. google, influencer's name)",
    },
    {
      name: "medium",
      input: "",
      label: "Medium",
      param: "utm_medium",
      error: "",
      helpText: "Marketing medium: (e.g. cpc, banner, email)",
    },
    {
      name: "campaign",
      input: "",
      label: "Campaign",
      param: "utm_campaign",
      error: "",
      helpText: "Product, promo code, or slogan (e.g. spring_sale)",
    },
    {
      name: "term",
      input: "",
      label: "Key Word",
      param: "utm_term",
      error: "",
      helpText:
        "A paid search term associated with this link (e.g. black dress, wave bracelet)",
    },
    {
      name: "content",
      input: "",
      label: "Content",
      param: "utm_content",
      error: "",
      helpText:
        "Description of the ad or location of the link (e.g. top banner, black dress version A)",
    },
  ]);

  const [outputParams, setOutputParams] = useState("");

  const isProduct = useMemo(() => type === "Product", [type]);
  const query = isProduct ? GET_PRODUCT_LINK : GET_COLLECTION_HANDLE;

  const [getLink, { loading, error, data }] = useLazyQuery(query, {
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
      let url;
      if (isProduct) {
        console.log(data);
        url = data.product.onlineStorePreviewUrl;
      } else {
        url =
          "https://" + shopOrigin + "/collections/" + data.collection.handle;
      }
      setLink(url);
    }
  }, [data]);

  //When user typing into one of the text field, update the query params
  useEffect(() => {
    let outputParams = "?";
    const outputData = [];
    for (const data of params) {
      if (data.input != "") {
        const query = data.param + "=" + data.input;
        outputData.push(query);
      }
    }
    for (const [index, param] of outputData.entries()) {
      const length = outputData.length;
      if (index + 1 !== length) {
        outputParams += param + "&";
      } else {
        outputParams += param;
      }
    }
    setOutputParams(outputParams);
  }, [params]);

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

  const updateParams = (i, value) => {
    setParams((arr) => {
      const newData = arr.map((param, index) => {
        if (i !== index) {
          return param;
        } else {
          return { ...param, input: value };
        }
      });
      return newData;
    });
  };

  const onSave = () => {
    if (params[0].input === "" || link === "") {
      if (params[0].input === "") {
        setParams((params) =>
          params.map((param, index) =>
            index === 0 ? { ...param, error: "Source is required" } : param
          )
        );
      } else {
        setParams((params) =>
          params.map((param, index) =>
            index === 0 ? { ...param, error: "" } : param
          )
        );
      }
      if (link === "") {
        setLinkError("Please choose a product to add a link");
      } else {
        setLinkError("");
      }
    } else {
      const paramsArr = params.map(({ param, input }) => ({ param, input }));
      axios({
        method: "POST",
        url: "/links",
        data: {
          resource_link: link + outputParams,
          paramsArr,
          resource_type: type,
          store_id: shopOrigin,
        },
        withCredentials: true,
      })
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
    }
  };

  return (
    <Page
      breadcrumbs={[{ content: "Home", url: "/" }]}
      title="Create a link"
      primaryAction={
        <Button loading={loading} primary onClick={() => setPickerOpen(true)}>
          {link === ""
            ? `Pick a ${isProduct ? "product" : "collection"} to start`
            : `Choose another ${isProduct ? "product" : "collection"}`}
        </Button>
      }
    >
      <ContextualSaveBar
        message="Unsaved changes"
        saveAction={{
          onAction: () => onSave(),
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
              {params.map((param, index) => (
                <TextField
                  key={index}
                  value={param.input}
                  label={param.label}
                  onChange={(value) => updateParams(index, value)}
                  error={param.error}
                  helpText={param.helpText}
                />
              ))}
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
                label="Link"
                value={link !== "" && link + outputParams}
                multiline={true}
                id="copy_link"
                error={linkError}
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
                      source={
                        type === "Product"
                          ? productInfo.images[0].originalSrc
                          : productInfo.image.originalSrc
                      }
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
                <TextStyle variation="subdued">No Product To Preview</TextStyle>
              </h1>
            )}
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      {toastMarkup}
    </Page>
  );
}
