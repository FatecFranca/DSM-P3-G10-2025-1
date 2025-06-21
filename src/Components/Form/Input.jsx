import React from "react";
import styles from "./Input.module.css";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  autoFocus = false,
  disabled,
  readOnly,
  maxLength,
  minLength,
  min,
  max,
  step,
  autoComplete,
  ...rest // Captura outras props que não devem ir para o DOM
}) => {
  // Props válidas para input
  const inputProps = {
    type,
    id: name,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required,
    autoFocus,
    disabled,
    readOnly,
    maxLength,
    minLength,
    min,
    max,
    step,
    autoComplete,
  };

  // Remove props undefined
  Object.keys(inputProps).forEach(
    (key) => inputProps[key] === undefined && delete inputProps[key]
  );

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        {...inputProps}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;

