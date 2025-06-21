// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (serviceFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { 
    immediate = true, 
    onSuccess, 
    onError,
    defaultData = null 
  } = options;

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await serviceFunction(...args);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    } else {
      setLoading(false);
      setData(defaultData);
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

// Hook para mutações (POST, PUT, DELETE)
export const useMutation = (serviceFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { onSuccess, onError } = options;

  const mutate = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await serviceFunction(...args);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
    reset: () => {
      setError(null);
      setLoading(false);
    },
  };
};
