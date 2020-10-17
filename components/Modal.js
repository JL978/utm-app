import React, { useState, useCallback } from "react";
import { FormLayout, TextField, Modal } from "@shopify/polaris";

export default function ModalMarkup({ toggleModalActive, modalActive }) {
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const handleSubjectChange = useCallback(
    (value) => setSupportSubject(value),
    []
  );
  const handleMessageChange = useCallback(
    (value) => setSupportMessage(value),
    []
  );
  return (
    <Modal
      open={modalActive}
      onClose={toggleModalActive}
      title="Contact support"
      primaryAction={{
        content: "Send",
        onAction: toggleModalActive,
      }}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Subject"
            value={supportSubject}
            onChange={handleSubjectChange}
          />
          <TextField
            label="Message"
            value={supportMessage}
            onChange={handleMessageChange}
            multiline
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}
