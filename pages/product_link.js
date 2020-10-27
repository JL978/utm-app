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
        type="Product"
      />
      <ResourcePicker
        open={pickerOpen}
        resourceType="Product"
        showVariants={false}
        onCancel={() => setPickerOpen(false)}
        onSelection={(choice) => {
          const product = choice.selection[0];
          const { id, title, handle, images, descriptionHtml } = product;
          setId(id);
          setProductInfo({ title, handle, images, descriptionHtml });
          setPickerOpen(false);
        }}
      />
    </>
  );
}
