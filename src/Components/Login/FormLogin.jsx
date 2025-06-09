import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Form/Input";
import Button from "../Form/Button";
import styles from "./FormLogin.module.css";
import stylesBtn from "../Form/Button.module.css";
import useForm from "../../hooks/useForm";  // ← Corrigido: hooks (minúsculo)
import { useUser } from "../../context/UserContext";

const FormLogin = () => {
  const email = useForm("email");
  const password = useForm("");
  const navigate = useNavigate();
  const { login } = useUser();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!email.validate() || !password.validate()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email.value, password.value);
      navigate("/conta");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="animeDown">
      <h1 className="title">Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="E-mail" type="email" name="email" {...email} />
        <Input label="Senha" type="password" name="password" {...password} />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <Link to="recuperar" className={styles.forget}>
          Esqueceu a Senha?
        </Link>
        <Button disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className={styles.cadastro}>
        <h2 className={styles.subtitle}>Cadastre-se</h2>
        <p>Ainda não possui conta? Cadastre-se no site.</p>
        <Link className={stylesBtn.button} to="cadastro">
          Cadastro
        </Link>
      </div>
    </section>
  );
};

export default FormLogin;

