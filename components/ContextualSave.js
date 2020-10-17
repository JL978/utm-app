const contextualSaveBarMarkup = isDirty ? (
  <ContextualSaveBar
    message="Unsaved changes"
    saveAction={{
      onAction: handleSave,
    }}
    discardAction={{
      onAction: handleDiscard,
    }}
  />
) : null;
