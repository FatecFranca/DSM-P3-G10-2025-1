import { apiRequest } from './api';

class AuthService {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api'
        : '/api';
    }
    return 'http://localhost:3001/api';
  }

  // Login usando endpoint /users (baseado na sua API)
  async login(email, password) {
    try {
      console.log('🔍 Tentando fazer login com:', email);
      
      // Buscar todos os usuários da API
      const users = await apiRequest('/users');
      console.log('👥 Usuários encontrados:', users.length);
      
      // Procurar usuário por email
      const foundUser = users.find(u => 
        u.email && u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!foundUser) {
        console.log('❌ Usuário não encontrado');
        const availableEmails = users.map(u => u.email).filter(Boolean);
        throw new Error(`Usuário não encontrado. Emails disponíveis: ${availableEmails.join(', ')}`);
      }

      console.log('✅ Usuário encontrado:', foundUser.name);

      // Verificar senha
      if (foundUser.password && foundUser.password !== password) {
        throw new Error('Senha incorreta');
      }

      // Se não tem campo password, aceitar qualquer senha para demo
      if (!foundUser.password) {
        console.log('⚠️ Usuário sem senha definida, aceitando login');
      }

      // Criar token simulado
      const token = `token-${foundUser.id}-${Date.now()}`;
      
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      };

      console.log('🎉 Login realizado com sucesso!');
      return { 
        success: true, 
        data: { token, user: userData } 
      };

    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  // Registro
  async register(userData) {
    try {
      console.log('📝 Tentando registrar usuário:', userData.name);
      
      // Verificar se email já existe
      const users = await apiRequest('/users');
      const existingUser = users.find(u => 
        u.email && u.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('Este email já está cadastrado');
      }

      // Criar novo usuário
      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString()
      };

      console.log('🚀 Enviando dados para API');
      const createdUser = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
      });

      console.log('✅ Usuário criado com sucesso:', createdUser);

      // Criar token
      const token = `token-${createdUser.id}-${Date.now()}`;
      
      const userForStorage = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email
      };

      console.log('🎉 Registro realizado com sucesso!');
      return { 
        success: true, 
        data: { token, user: userForStorage } 
      };

    } catch (error) {
      console.error('❌ Erro no registro:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  // Verificar token
  async verifyToken(token) {
    try {
      // Para demonstração, verificar se token existe e é válido
      if (!token || !token.startsWith('token-')) {
        throw new Error('Token inválido');
      }

      return { 
        success: true, 
        data: { valid: true } 
      };

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  // Buscar usuários (útil para debug)
  async getUsers() {
    try {
      const users = await apiRequest('/users');
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }
}

export default new AuthService();