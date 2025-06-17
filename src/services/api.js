import axios from 'axios';

// Criando instância do axios com configuração base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptador para logs de debug
api.interceptors.request.use(
  config => {
    console.log(`[API] Fazendo requisição: ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('[API] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptador para tratar erros nas respostas
api.interceptors.response.use(
  response => {
    console.log(`[API] Resposta recebida: ${response.status} - ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`[API] Erro ${error.response.status}: ${error.response.data?.message || 'Erro no servidor'}`);
    } else if (error.request) {
      console.error('[API] Sem resposta do servidor:', error.message);
    } else {
      console.error('[API] Erro na configuração:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;