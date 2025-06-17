import { useState } from 'react';

const useForm = (type = '') => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);

  const validate = (val = value) => {
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val.trim()) {
        setError('E-mail é obrigatório');
        return false;
      } else if (!emailRegex.test(val)) {
        setError('E-mail inválido');
        return false;
      }
    } else if (type === 'password') {
      if (!val.trim()) {
        setError('Senha é obrigatória');
        return false;
      } else if (val.length < 6) {
        setError('Senha deve ter pelo menos 6 caracteres');
        return false;
      }
    } else {
      if (!val.trim()) {
        setError('Campo é obrigatório');
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  const onChange = ({ target }) => {
    if (error) validate(target.value);
    setValue(target.value);
  };

  return {
    value,
    setValue,
    onChange,
    error,
    validate,
    onBlur: () => validate()
  };
};

export default useForm;