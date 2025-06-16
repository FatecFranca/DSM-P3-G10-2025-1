import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../Form/Input';
import Button from '../Form/Button';
import Error from '../Helper/Error';
import styles from './FormCadastro.module.css';
import api from '../../services/api';

const FormCadastro = () => {
  // Estados para campos obrigatórios
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para campos opcionais
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Estados para controle do formulário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  
  const navigate = useNavigate();
  
  // Validação do formulário
  const validateStep1 = () => {
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    
    if (!email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, informe um email válido');
      return false;
    }
    
    // Username é opcional no modelo, mas se fornecido, verificamos
    if (username && username.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const validateStep2 = () => {
    if (password.length < 6) {
      setError('A senha precisa ter no mínimo 6 caracteres');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return false;
    }
    
    setError(null);
    return true;
  };

  // Avançar para a próxima etapa
  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  // Voltar para a etapa anterior
  const prevStep = () => {
    setStep(1);
  };

  // Envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Construindo o objeto de dados exatamente como o back-end espera
      const userData = {
        name, // Obrigatório
        email, // Obrigatório 
        password, // Obrigatório
      };
      
      // Adicionando campos opcionais apenas se tiverem valores
      if (username && username.trim()) {
        userData.username = username.trim();
      }
      
      if (avatarUrl && avatarUrl.trim()) {
        userData.avatarUrl = avatarUrl.trim();
      }
      
      console.log('Enviando dados para registro:', userData);
      
      // Chamada direta para a API
      const response = await api.post('/auth/register', userData);
      
      console.log('Resposta do servidor:', response.data);
      
      if (response.data && response.data.token) {
        // Salvar token e dados do usuário
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirecionar para a página de conta
        navigate('/conta');
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      
      if (err.response) {
        // Extrair mensagem específica do back-end
        const backendError = err.response.data;
        console.log('Resposta do back-end:', backendError);
        
        if (err.response.status === 409) {
          // Verificar se é erro de unicidade (email ou username já existente)
          if (backendError.message && backendError.message.includes('email')) {
            setError('Este email já está em uso');
          } else if (backendError.message && backendError.message.includes('username')) {
            setError('Este nome de usuário já está em uso');
          } else {
            setError(backendError.message || 'Email ou username já cadastrado');
          }
        } else if (backendError.message) {
          // Outras mensagens de erro do back-end
          setError(backendError.message);
        } else {
          setError(`Erro no servidor (${err.response.status})`);
        }
      } else if (err.request) {
        // Erro de conexão
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Outros erros
        setError(err.message || 'Erro ao processar o cadastro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Criar sua conta</h1>
        <p className={styles.subtitle}>
          {step === 1 
            ? 'Preencha seus dados pessoais' 
            : 'Configure sua senha de acesso'}
        </p>
        
        {error && <Error error={error} />}
        
        <form onSubmit={step === 1 ? nextStep : handleSubmit} className={styles.form}>
          {step === 1 ? (
            <>
              <Input
                label="Nome completo *"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <Input
                label="E-mail *"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input
                label="Nome de usuário (opcional)"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="Seu identificador único"
              />
              
              <Button type="submit">
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Input
                label="Senha *"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
              />
              
              <Input
                label="Confirmar senha *"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <Input
                label="URL da foto de perfil (opcional)"
                type="url"
                name="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Link para sua foto"
              />
              
              <div className={styles.buttonGroup}>
                <Button type="button" onClick={prevStep} variant="secondary">
                  Voltar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Criar conta'}
                </Button>
              </div>
            </>
          )}
        </form>
        
        <div className={styles.loginLink}>
          <p>
            Já tem uma conta?{' '}
            <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FormCadastro;