import { useState } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { method = 'GET', data = null, params = null, headers = {} } = options;
      
      const config = {
        method,
        url: endpoint,
        data,
        params,
        headers
      };
      
      const response = await api(config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro na requisição');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

// Para compatibilidade com importações existentes
export default api;