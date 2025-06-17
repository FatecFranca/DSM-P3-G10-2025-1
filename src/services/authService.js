class AuthService {
  constructor() {
    // Não usar process.env no constructor - só funciona em build
    this.baseURL = 'http://localhost:3001/api';
  }

  // Método para configurar URL dinamicamente
  getBaseURL() {
    // Verificar se existe variável de ambiente (só em build)
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    
    // URL padrão para desenvolvimento
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api'
      : '/api';
  }

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // Verificar se o token não expirou
      if (token) {
        const tokenData = this.parseJwt(token);
        if (tokenData && tokenData.exp * 1000 > Date.now()) {
          return !!(token && user);
        } else {
          // Token expirado, limpar storage
          this.logout();
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }

  // Decodificar JWT (sem validação - apenas para verificar expiração)
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Obter usuário atual
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  // Login com API real
  async login(email, password) {
    try {
      const baseURL = this.getBaseURL();
      
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data.token && data.user) {
        // Salvar dados no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || 'Login realizado com sucesso'
        };
      } else {
        throw new Error('Resposta inválida do servidor');
      }

    } catch (error) {
      console.error('Erro no login:', error);
      
      // Se não conseguir conectar com API, usar dados simulados temporariamente
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.warn('Usando dados simulados - API não disponível');
        return this.simulateLogin(email, password);
      }
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro ao fazer login';
      
      if (error.message.includes('401')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('400')) {
        errorMessage = 'Dados inválidos. Verifique email e senha.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // Registro com API real
  async register(userData) {
    try {
      const baseURL = this.getBaseURL();
      
      const response = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name.trim(),
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          username: userData.username?.trim() || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data.token && data.user) {
        // Salvar dados no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || 'Cadastro realizado com sucesso'
        };
      } else {
        throw new Error('Resposta inválida do servidor');
      }

    } catch (error) {
      console.error('Erro no registro:', error);
      
      // Se não conseguir conectar com API, usar dados simulados temporariamente
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.warn('Usando dados simulados - API não disponível');
        return this.simulateRegister(userData);
      }
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro ao criar conta';
      
      if (error.message.includes('409')) {
        errorMessage = 'Este email já está em uso';
      } else if (error.message.includes('400')) {
        errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // Simulação para quando API não estiver disponível
  async simulateLogin(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          const userData = {
            id: Date.now(),
            name: 'Usuário Teste',
            email: email,
            createdAt: new Date().toISOString()
          };
          
          const token = 'fake-jwt-token-' + Date.now();
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          resolve({
            success: true,
            user: userData,
            token: token,
            message: 'Login realizado (modo simulado)'
          });
        } else {
          resolve({
            success: false,
            message: 'Email e senha são obrigatórios'
          });
        }
      }, 1000);
    });
  }

  async simulateRegister(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userData.name && userData.email && userData.password) {
          const user = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            username: userData.username || null,
            createdAt: new Date().toISOString()
          };
          
          const token = 'fake-jwt-token-' + Date.now();
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          resolve({
            success: true,
            user: user,
            token: token,
            message: 'Cadastro realizado (modo simulado)'
          });
        } else {
          resolve({
            success: false,
            message: 'Nome, email e senha são obrigatórios'
          });
        }
      }, 1000);
    });
  }

  // Logout
  async logout() {
    try {
      const token = localStorage.getItem('token');
      
      // Tentar notificar o servidor sobre o logout
      if (token) {
        try {
          const baseURL = this.getBaseURL();
          await fetch(`${baseURL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.warn('Erro ao notificar servidor sobre logout:', error);
          // Não é crítico se falhar
        }
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Sempre limpar o localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Fazer requisições autenticadas
  async authenticatedRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    const baseURL = this.getBaseURL();
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${baseURL}${endpoint}`, finalOptions);
      
      if (response.status === 401) {
        // Token inválido ou expirado
        this.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }

    } catch (error) {
      console.error('Erro na requisição autenticada:', error);
      throw error;
    }
  }
}

export default new AuthService();