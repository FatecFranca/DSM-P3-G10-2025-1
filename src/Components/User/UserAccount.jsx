import React from "react";
import styles from "./UserAccount.module.css";
const UserAccount = () => {
  return (
    <section className={`${styles.content} animeDown`}>
      <h1 className="title">Minha Conta</h1>
      <div className={styles.user}>
        <h2 className={styles.name}>Nome da Pessoa Aqui</h2>
        <p>Conta criada: data de criaçõa aqui</p>
        <p>Email: email aqui</p>
        <p>Quantidade de Reviews: 0</p>
        <p>Quantidade de Posts: 0</p>
      </div>
    </section>
  );
};

export default UserAccount;
