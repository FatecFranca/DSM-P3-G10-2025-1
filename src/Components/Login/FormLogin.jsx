import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Form/Input";
import Button from "../Form/Button";
import styles from "./FormLogin.module.css";
import { useAuthContext } from "../../context/AuthContext";

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const validateForm = () => {
    let valid = true;
    
    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('E-mail inválido');
      valid = false;
    } else {
      setEmailError('');
    }
    
    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
      valid = false;
    } else {
      setPasswordError('');
    }
    
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/conta');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="animeDown">
      <h1 className="title">Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input 
          label="E-mail" 
          type="email" 
          name="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          required
        />
        <Input 
          label="Senha" 
          type="password" 
          name="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          required
        />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <Link to="recuperar" className={styles.forget}>
          Esqueceu a Senha?
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className={styles.cadastro}>
        <h2 className={styles.subtitle}>Cadastre-se</h2>
        <p>Ainda não possui conta? Cadastre-se no site.</p>
        <Link className={styles.button} to="/register">
          Cadastro
        </Link>
      </div>
    </section>
  );
};

export default FormLogin;