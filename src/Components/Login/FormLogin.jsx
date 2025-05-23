import React from "react";
import { Link, useNavigate} from "react-router-dom";
import Input from "../Form/Input";
import Button from "../Form/Button";
import styles from "./FormLogin.module.css";
import stylesBtn from "../Form/Button.module.css";
import useForm from "../../Hooks/useForm";
const FormLogin = () => {
  // usa email.value e password.value para pegar o valor do input
  // usa email.validate() e password.validate() para validar o input
  const email = useForm('email');
  const password = useForm('password');
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    if (email.validate() && password.validate()) {
      console.log(email.value, password.value);
      navigate('/');
  }
  }
  return (
    <section className="animeDown">
      <h1 className="title">Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="E-mail" type="email" name="email" {...email} />
        <Input label="Senha" type="password" name="password" {...password} />
        <Button>Entrar</Button>
      </form>
      <div className={styles.cadastro}>
        <h2 className={styles.subtitle}>Cadastre-se</h2>
        <p>Ainda não possui conta? Cadastre-se no site.</p>
        <Link className={stylesBtn.button} to="/cadastro">
          Cadastro
        </Link>
      </div>
    </section>
  );
};

export default FormLogin;
