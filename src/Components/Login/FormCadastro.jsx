import React from "react";
import { Link, useNavigate} from "react-router-dom";
import Input from "../Form/Input";
import Button from "../Form/Button";
import styles from "./FormCadastro.module.css";
import useForm from "../../Hooks/useForm";
const FormCadastro = () => {
  // usa email.value e password.value para pegar o valor do input
  // usa email.validate() e password.validate() para validar o input
  const name = useForm('');
  const email = useForm('email');
  const password = useForm('');
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    if (email.validate() && password.validate()) {
      console.log(email.value, password.value);
      navigate('/login');
  }
  }
  return (
    <section className={`${styles.content} animedown`}>
      <h1 className="title">Cadastro</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Nome Completo" type="text" name="name" {...name} />
        <Input label="E-mail" type="email" name="email" {...email} />
        <Input label="Senha" type="password" name="password" {...password} />
        <Button>Entrar</Button>
      </form>
    </section>
  );
};

export default FormCadastro;
