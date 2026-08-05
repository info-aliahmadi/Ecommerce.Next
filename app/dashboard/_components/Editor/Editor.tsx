"use client";

import { useCallback, useRef } from "react";
import { DefaultTemplate, DefaultTemplateRef } from "./DefaultTemplate";
import { Locale } from "@root/locales/Language";

type EditorProps = {
  id?: string;
  name?: string;
  value?: string;
  setFieldValue?: (field: string, value: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string,
  className?: string;
};

export default function Editor({
  id,
  name,
  value = "",
  setFieldValue,
  onChange,
  placeholder = "",
  className,
}: Readonly<EditorProps>) {
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
    />
  );
}
