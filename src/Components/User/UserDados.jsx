import React from "react";
import styles from "./UserDados.module.css";
import Input from "../Form/Input";
import Button from "../Form/Button";
import useForm from "../../Hooks/useForm";
const UserDados = () => {
  const username = useForm("");
  const email = useForm("email");
  const password = useForm("");
  const newPassword = useForm("");
  function onSubmitName(event) {
    event.preventDefault();
    if (username.validate()) {
      console.log(username.value);
      //adiciona aqui a logica para dar update
    }
  }
  function onSubmitEmail(event) {
    event.preventDefault();
    if (email.validate()) {
      console.log(email.value);
      //adiciona aqui a logica para dar update
    }
  }
  function onSubmitPassword(event) {
    event.preventDefault();
    if (
      password.validate() &&
      newPassword.validate() &&
      password.value !== newPassword.value
    ) {
      console.log(password.value, newPassword.value);
      //adiciona aqui a logica para dar update
    }
  }
  return (
    <section className={`${styles.content} animeDown`}>
      <h1 className="title">Dados</h1>
      <div className={styles.user}>
        <div className={styles.dados}>
          <h2>Alterar Dados</h2>
          <form onSubmit={onSubmitName}>
            <Input label="Nome" type="text" name="name" {...username} />
            <Button className={styles.buttonNoFocus}>Alterar</Button>
          </form>
          <form onSubmit={onSubmitEmail}>
            <Input label="Email" type="email" name="email" {...email} />
            <Button className={styles.buttonNoFocus}>Alterar</Button>
          </form>
        </div>
        <div className={styles.password}>
          <h2>Alterar Senha</h2>
          <form onSubmit={onSubmitPassword}>
            <Input
              label="Senha Atual"
              type="password"
              name="password"
              {...password}
            />
            <Input
              label="Nova Senha"
              type="password"
              name="newPassword"
              {...newPassword}
            />
            <Button className={styles.buttonNoFocus}>Alterar</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserDados;
