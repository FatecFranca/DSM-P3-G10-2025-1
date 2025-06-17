Login/FormCadastro.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../Form/Input';
import Button from '../Form/Button';
import Error from '../Helper/Error';
import styles from './FormCadastro.module.css';
import api from '../../services/api';

// Componente para mostrar força da senha
const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength += 1;
    if (pass.length >= 10) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ['', 'Fraca', 'Razoável', 'Média', 'Forte', 'Muito forte'];
  const strengthColor = ['', '#ff4d4d', '#ffaa00', '#ffff00', '#aaffaa', '#00cc00'];

  return (
    <div className={styles.passwordStrength}>
      <div className={styles.strengthBar}>
        {[1, 2, 3, 4, 5].map(index => (
          <div
            key={index}
            className={`${styles.strengthSegment} ${index <= strength ? styles.active : ''}`}
            style={{ backgroundColor: index <= strength ? strengthColor[strength] : '' }}
          />
        ))}
      </div>
      {password && (
        <span className={styles.strengthText} style={{ color: strengthColor[strength] }}>
          {strengthText[strength]}
        </span>
      )}
    </div>
  );
};

const FormCadastro = () => {
  // Estados para campos obrigatórios
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para campos opcionais
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Estados para validações em tempo real
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Estados para controle do formulário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
    confirmPassword: false
  });
  
  const navigate = useNavigate();
  
  // Validação em tempo real
  useEffect(() => {
    if (touched.name) {
      if (!name.trim()) setNameError('Nome é obrigatório');
      else if (name.trim().length < 3) setNameError('Nome deve ter pelo menos 3 caracteres');
      else setNameError('');
    }
    
    if (touched.email) {
      if (!email.trim()) setEmailError('Email é obrigatório');
      else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) setEmailError('Email inválido');
        else setEmailError('');
      }
    }
    
    if (touched.username && username) {
      if (username.length < 3) setUsernameError('Nome de usuário deve ter pelo menos 3 caracteres');
      else setUsernameError('');
    }
    
    if (touched.password) {
      if (password.length < 6) setPasswordError('A senha precisa ter no mínimo 6 caracteres');
      else setPasswordError('');
    }
    
    if (touched.confirmPassword) {
      if (password !== confirmPassword) setConfirmPasswordError('As senhas não conferem');
      else setConfirmPasswordError('');
    }
  }, [name, email, username, password, confirmPassword, touched]);
  
  // Validação do formulário
  const validateStep1 = () => {
    setTouched({
      ...touched,
      name: true,
      email: true,
      username: true
    });
    
    if (nameError || emailError || usernameError) return false;
    if (!name.trim() || !email.trim()) return false;
    
    return true;
  };
  
  const validateStep2 = () => {
    setTouched({
      ...touched,
      password: true,
      confirmPassword: true
    });
    
    if (passwordError || confirmPasswordError) return false;
    if (password.length < 6 || password !== confirmPassword) return false;
    
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

  // Marcar campo como tocado quando o usuário interage
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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
      
      const userData = {
        name,
        email,
        password,
        ...(username && { username: username.trim() }),
        ...(avatarUrl && { avatarUrl: avatarUrl.trim() })
      };
      
      const response = await api.post('/users', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
        
        setSuccess('Cadastro realizado com sucesso!');
        setTimeout(() => {
          navigate('/conta');
        }, 1500);
      } else {
        setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        const backendError = err.response.data;
        
        if (err.response.status === 409) {
          setError(backendError.message || 'Email ou nome de usuário já cadastrado');
        } else if (backendError.message) {
          setError(backendError.message);
        } else {
          setError(`Erro no servidor (${err.response.status})`);
        }
      } else if (err.message === 'Network Error') {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        setError(err.message || 'Erro ao processar o cadastro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Cabeçalho com título e passos */}
        <div className={styles.header}>
          <h1 className={styles.title}>Crie sua conta de gamer</h1>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
          
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>1</div>
              <span>Dados pessoais</span>
            </div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>2</div>
              <span>Credenciais</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className={styles.errorContainer}>
            <Error error={error} />
          </div>
        )}
        
        {success && (
          <div className={styles.successContainer}>
            <div className={styles.success}>
              <svg viewBox="0 0 24 24" className={styles.successIcon}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <p>{success}</p>
            </div>
          </div>
        )}
        
        <div className={styles.formContainer}>
          <form onSubmit={step === 1 ? nextStep : handleSubmit} className={styles.form}>
            {step === 1 ? (
              <div className={styles.formStep}>
                <div className={styles.inputGroup}>
                  <Input
                    label="Nome completo"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    error={nameError}
                    required
                    autoFocus
                  />
                  <small className={styles.hint}>Como você quer ser chamado na comunidade</small>
                </div>
                
                <div className={styles.inputGroup}>
                  <Input
                    label="E-mail"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={emailError}
                    required
                  />
                  <small className={styles.hint}>
                    Usamos seu e-mail para login e notificações importantes
                  </small>
                </div>
                
                <div className={styles.inputGroup}>
                  <Input
                    label="Nome de usuário (opcional)"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    onBlur={() => handleBlur('username')}
                    error={usernameError}
                    placeholder="Ex: gamer_123"
                  />
                  <small className={styles.hint}>
                    Seu identificador único na plataforma (sem espaços)
                  </small>
                </div>
                
                <Button 
                  type="submit" 
                  className={styles.nextButton}
                >
                  Continuar <span className={styles.buttonIcon}>→</span>
                </Button>
              </div>
            ) : (
              <div className={styles.formStep}>
                <div className={styles.inputGroup}>
                  <div className={styles.passwordField}>
                    <Input
                      label="Senha"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur('password')}
                      error={passwordError}
                      required
                      autoFocus
                    />
                    <button 
                      type="button" 
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  <small className={styles.hint}>
                    Mínimo de 6 caracteres. Utilize letras, números e símbolos para maior segurança
                  </small>
                  <PasswordStrength password={password} />
                </div>
                
                <div className={styles.inputGroup}>
                  <div className={styles.passwordField}>
                    <Input
                      label="Confirmar senha"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      error={confirmPasswordError}
                      required
                    />
                    <button 
                      type="button" 
                      className={styles.togglePassword}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
                
                <div className={styles.inputGroup}>
                  <Input
                    label="URL da foto de perfil (opcional)"
                    type="url"
                    name="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://sua-foto.com/imagem.jpg"
                  />
                  <small className={styles.hint}>
                    Link para sua imagem de perfil
                  </small>
                  
                  {avatarUrl && (
                    <div className={styles.avatarPreview}>
                      <img 
                        src={avatarUrl} 
                        alt="Preview da foto de perfil" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100?text=Erro";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className={styles.buttonGroup}>
                  <Button 
                    type="button" 
                    onClick={prevStep} 
                    variant="secondary"
                  >
                    <span className={styles.buttonIcon}>←</span> Voltar
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className={styles.spinner}></span>
                        Cadastrando...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        <div className={styles.loginLink}>
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className={styles.highlightLink}>Faça login</Link>
          </p>
        </div>
        
        <div className={styles.securityInfo}>
          <div className={styles.securityIcon}>🔒</div>
          <p>Seus dados estão protegidos e nunca serão compartilhados</p>
        </div>
      </div>
    </section>
  );
};

export default FormCadastro;