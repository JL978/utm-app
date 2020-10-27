import React, { useState } from "react";
import LinkSetting from "../components/LinkSetting";
import { ResourcePicker } from "@shopify/app-bridge-react";

export default function product_link() {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [id, setId] = useState("");
  const [productInfo, setProductInfo] = useState(null);

  return (
    <>
      <LinkSetting
        id={id}
        productInfo={productInfo}
        setPickerOpen={setPickerOpen}
        type="Collection"
      />
      <ResourcePicker
        open={pickerOpen}
        resourceType="Collection"
        showVariants={false}
        onCancel={() => setPickerOpen(false)}
        onSelection={(choice) => {
          const { selection } = choice;
          const product = selection[0];
          console.log(product);
          const { id, title, handle, image, descriptionHtml } = product;
          setId(id);
          setProductInfo({ title, handle, image, descriptionHtml });
          setPickerOpen(false);
        }}
      />
    </>
  );
}
