import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Input from '../Form/Input';
import Button from '../Form/Button';
import Error from '../Helper/Error';
import styles from './FormCadastro.module.css';

const FormCadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login, isAuthenticated } = useAuthContext();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validação básica
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      // Em um aplicativo real, aqui você chamaria sua API
      // const response = await authService.register({ name, email, password });
      
      // Simulação de registro bem-sucedido para demonstração
      setTimeout(() => {
        // Simular dados de usuário retornados pela API
        const userData = {
          id: Math.floor(Math.random() * 1000),
          name,
          email,
          role: 'user'
        };
        
        // Token simulado
        const token = 'demo-register-token-' + Date.now();
        
        // Usar o método login do contexto para salvar o usuário e token
        login(userData, token);
        
        // Redirecionar para a página inicial após o login
        navigate('/');
      }, 1000);
      
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      setError(message);
      setLoading(false);
    }
  };
  
  return (
    <section className={`${styles.section} animeDown`}>
      <h1 className={styles.title}>Cadastre-se</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <Error error={error} />}
        
        <Input
          label="Nome completo"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          label="Senha"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Input
          label="Confirme sua senha"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
      
      <div className={styles.login}>
        <p>Já tem uma conta?</p>
        <Button onClick={() => navigate('/login')} variant="secondary">
          Faça login
        </Button>
      </div>
    </section>
  );
};

export default FormCadastro;