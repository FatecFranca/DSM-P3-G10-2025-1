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
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, authenticated } = useAuthContext();
  
  const fromPage = location.state?.from || '/';

  useEffect(() => {
    if (authenticated) {
      navigate(fromPage, { replace: true });
    }
  }, [authenticated, navigate, fromPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let result;
      
      if (isLogin) {
        if (!email || !password) {
          throw new Error('Por favor, preencha todos os campos');
        }
        
        console.log('Tentando fazer login...');
        result = await login(email, password);
        
        if (result.success) {
          setSuccess('Login realizado com sucesso! Redirecionando...');
          setTimeout(() => {
            navigate(fromPage, { replace: true });
          }, 1000);
        } else {
          setError(result.message);
        }
      } else {
        if (!name || !email || !password || !confirmPassword) {
          throw new Error('Por favor, preencha todos os campos');
        }
        if (password !== confirmPassword) {
          throw new Error('As senhas não conferem');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        
        console.log('Tentando registrar usuário...');
        result = await register({ name, email, password });
        
        if (result.success) {
          setSuccess('Conta criada com sucesso! Redirecionando...');
          setTimeout(() => {
            navigate(fromPage, { replace: true });
          }, 1000);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      console.log('Testando conexão com API...');
      
      const response = await fetch('http://localhost:3001/api');
      
      if (response.ok) {
        const data = await response.json();
        console.log('API conectada:', data);
        setSuccess('✅ API conectada com sucesso!');
        
        // Testar endpoint de usuários
        const usersResponse = await fetch('http://localhost:3001/api/users');
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          console.log('Usuários encontrados:', users.length);
          setSuccess(`✅ API conectada! ${users.length} usuários encontrados.`);
        }
      } else {
        setError(`❌ API retornou erro: ${response.status}`);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError(`❌ Erro de conexão: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Tentar login com conta demo
      const result = await login('demo@gamereviews.com', 'demo123');
      
      if (!result.success) {
        // Se não conseguir, criar conta demo
        console.log('Criando conta demo...');
        const registerResult = await register({
          name: 'Usuário Demo',
          email: 'demo@gamereviews.com',
          password: 'demo123'
        });
        
        if (registerResult.success) {
          setSuccess('Conta demo criada e login realizado!');
        } else {
          setError('Não foi possível criar conta demo');
        }
      } else {
        setSuccess('Login demo realizado com sucesso!');
      }
    } catch (err) {
      setError('Erro ao acessar conta demo');
    } finally {
      setLoading(false);
    }
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
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {success && (
          <div className={styles.successMessage}>
            {success}
          </div>
        )}
        
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
                required
              />
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
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
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
                required
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>
        
        <div className={styles.actionButtons}>
          <button 
            onClick={handleTestConnection}
            className={styles.testButton}
            disabled={loading}
          >
            {loading ? 'Testando...' : 'Testar Conexão API'}
          </button>
          
          <button 
            onClick={handleDemoLogin}
            className={styles.demoButton}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Login Demo'}
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
                : 'Crie uma conta para participar da nossa comunidade de gamers'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;