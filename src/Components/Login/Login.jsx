import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthContext();
  
  const fromPage = location.state?.from || '/';

  useEffect(() => {
    // Redirecionar se já estiver autenticado
    if (isAuthenticated) {
      navigate(fromPage, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPage]);

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email inválido';
    }
    
    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!isLogin) {
      if (!name) {
        errors.name = 'Nome é obrigatório';
      }
      
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Senhas não conferem';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Simulação de autenticação
      // Em um ambiente real, aqui você chamaria sua API
      if (isLogin) {
        // Login demo
        setTimeout(() => {
          login(
            { id: 1, name: 'Usuário Demo', email: email, role: 'user' },
            'demo-token-12345'
          );
          navigate(fromPage, { replace: true });
        }, 1000);
      } else {
        // Registro demo
        setTimeout(() => {
          login(
            { id: 2, name: name, email: email, role: 'user' },
            'demo-token-67890'
          );
          navigate(fromPage, { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error('Erro de autenticação:', err);
      setError(err.message || 'Ocorreu um erro durante a autenticação');
      setLoading(false);
    }
  };
  
  const handleDemoLogin = () => {
    // Login demo rápido
    login(
      { id: 1, name: 'Usuário Demo', email: 'demo@example.com', role: 'user' },
      'demo-token-12345'
    );
    navigate(fromPage, { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h1>{isLogin ? 'Login' : 'Criar Conta'}</h1>
          <p>
            {isLogin 
              ? 'Entre na sua conta para acessar todas as funcionalidades' 
              : 'Registre-se para começar a avaliar seus jogos favoritos'}
          </p>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className={formErrors.name ? styles.inputError : ''}
              />
              {formErrors.name && (
                <span className={styles.errorText}>{formErrors.name}</span>
              )}
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className={formErrors.email ? styles.inputError : ''}
            />
            {formErrors.email && (
              <span className={styles.errorText}>{formErrors.email}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className={formErrors.password ? styles.inputError : ''}
            />
            {formErrors.password && (
              <span className={styles.errorText}>{formErrors.password}</span>
            )}
          </div>
          
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite sua senha novamente"
                className={formErrors.confirmPassword ? styles.inputError : ''}
              />
              {formErrors.confirmPassword && (
                <span className={styles.errorText}>{formErrors.confirmPassword}</span>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              isLogin ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>
        
        <div className={styles.demoButtonContainer}>
          <button onClick={handleDemoLogin} className={styles.demoButton}>
            Entrar com Conta Demo
          </button>
        </div>
        
        <div className={styles.switchFormContainer}>
          {isLogin ? (
            <p>
              Ainda não tem uma conta?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                className={styles.switchButton}
              >
                Registre-se
              </button>
            </p>
          ) : (
            <p>
              Já tem uma conta?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                className={styles.switchButton}
              >
                Faça Login
              </button>
            </p>
          )}
        </div>
        
        <div className={styles.returnHome}>
          <Link to="/" className={styles.homeLink}>
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
      
      <div className={styles.imageWrapper}>
        <div className={styles.imageOverlay}>
          <div className={styles.imageContent}>
            <h2>{isLogin ? 'Bem-vindo de volta!' : 'Junte-se a nós!'}</h2>
            <p>
              {isLogin
                ? 'Avalie jogos, compartilhe suas opiniões e descubra novas experiências'
                : 'Crie uma conta para participar da nossa comunidade de gamers e entusiastas'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;