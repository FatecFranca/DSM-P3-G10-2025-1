import React from "react";

const validation = {
  email: {
    regex:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    message: "Preencha um email válido",
  },
  date: {
    validate: (value) => {
      if (!value) return "Campo obrigatório";

      const timestamp = Date.parse(value);
      if (isNaN(timestamp)) return "Data inválida";

      if (timestamp > Date.now()) {
        return "Data não pode ser futura";
      }
      return null;
    },
  },
};
const useForm = (type) => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(null);
  function validate(value) {
    if (type === false) return true;
    if (value.length === 0) {
      setError("Campo obrigatório");
      return false;
    } else if (validation[type]) {
      if (validation[type].regex && !validation[type].regex.test(value)) {
        setError(validation[type].message);
        return false;
      }
      if (validation[type].validate) {
        const errMsg = validation[type].validate(value);
        if (errMsg) {
          setError(errMsg);
          return false;
        }
      }
    }
    setError(null);
    return true;
  }

  function onChange({ target }) {
    if (error) validate(target.value);
    setValue(target.value);
  }
  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
};

export default useForm;
