"use client";

import { useCallback, useRef } from "react";
import { DefaultTemplate, DefaultTemplateRef } from "./DefaultTemplate";
import CONFIG from "@root/config";

type EditorProps = {
  id?: string;
  name?: string;
  value?: string;
  setFieldValue?: (field: string, value: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string,
  locale?: string,
  className?: string;
};

export default function Editor({
  id,
  name,
  value = "",
  setFieldValue,
  onChange,
  placeholder = "",
  locale = CONFIG.DEFAULT_LANGUAGE,
  className,
}: EditorProps) {
  const editorRef = useRef<DefaultTemplateRef>(null);
  const initialValueLoadedRef = useRef(false);
  const fieldName = name || id;

  const updateValue = useCallback(
    (html: string) => {
      if (fieldName && setFieldValue) {
        setFieldValue(fieldName, html);
      }
      onChange?.(html);
    },
    [fieldName, onChange, setFieldValue],
  );

  const handleReady = useCallback(
    (methods: DefaultTemplateRef) => {
      if (initialValueLoadedRef.current || !value) return;

      initialValueLoadedRef.current = true;
      methods.injectHTML(value);
      updateValue(value);
    },
    [value, updateValue],
  );

  return (
    <DefaultTemplate
      ref={editorRef}
      className={className}
      onReady={handleReady}
      onHtmlChange={updateValue}
      placeholder={placeholder}
      locale={locale}
    />
  );
}
