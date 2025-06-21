import React from "react";
import styles from "./Input.module.css"; // usa o mesmo CSS do Input

const Textarea = ({
  label,
  name,
  value,
  onChange,
  error,
  onBlur,
  placeholder,
  disabled,
  required,
  maxLength,
  minLength,
  rows = 5,
  cols,
  readOnly,
  autoComplete,
  autoFocus,
  ...rest // Captura outras props que não devem ir para o DOM
}) => {
  // Props válidas para textarea
  const textareaProps = {
    id: name,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    disabled,
    required,
    maxLength,
    minLength,
    rows,
    cols,
    readOnly,
    autoComplete,
    autoFocus,
  };

  // Remove props undefined
  Object.keys(textareaProps).forEach(
    (key) => textareaProps[key] === undefined && delete textareaProps[key]
  );

  return (
    <div className={styles.wrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <textarea className={styles.input} {...textareaProps} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Textarea;

