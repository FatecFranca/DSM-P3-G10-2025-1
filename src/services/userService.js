// src/services/userService.js
import apiRequest from './api';

export const userService = {
  // Obter todos os usuários
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return await apiRequest(endpoint);
  },

  // Obter usuário por ID
  async getUserById(id) {
    return await apiRequest(`/users/${id}`);
  },

  // Atualizar perfil do usuário
  async updateProfile(id, userData) {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Deletar usuário
  async deleteUser(id) {
    return await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Upload de avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return await apiRequest('/users/avatar', {
      method: 'POST',
      headers: {}, // Remove Content-Type para FormData
      body: formData,
    });
  },
};