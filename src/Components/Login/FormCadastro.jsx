import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Input from '../Form/Input';
import Button from '../Form/Button';
import Error from '../Helper/Error';
import styles from './FormCadastro.module.css';

const FormCadastro = () => {
  // Estados para campos obrigatórios
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para campos opcionais (apenas avatarUrl, removemos bio)
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Estados para controle do formulário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // Para formulário multi-etapa
  
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthContext();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
    
    if (!username.trim()) {
      setError('Nome de usuário é obrigatório');
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
      
      // Dados para o cadastro - formato esperado pelo back-end
      const userData = {
        name,
        email,
        username,
        password,
        avatarUrl: avatarUrl || undefined // Envia apenas se tiver valor
      };
      
      // Chamada para o back-end via AuthContext
      const result = await register(userData);
      
      if (result.success) {
        // Redirecionamento após registro bem-sucedido
        navigate('/conta');
      } else {
        // Exibe mensagem de erro retornada pelo back-end
        setError(result.message);
      }
    } catch (err) {
      console.error('Erro durante o cadastro:', err);
      
      // Tratamentos específicos de erro do back-end
      if (err.response) {
        // O servidor respondeu com um status de erro
        if (err.response.status === 409) {
          setError('Este e-mail ou nome de usuário já está em uso');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Falha no cadastro. Verifique os dados e tente novamente.');
        }
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Ocorreu um erro ao configurar a requisição
        setError('Ocorreu um erro ao processar seu cadastro.');
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
                label="Nome completo"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input
                label="Nome de usuário"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="Seu identificador único"
                required
              />
              
              <Button type="submit">
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Input
                label="Senha"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
              />
              
              <Input
                label="Confirmar senha"
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