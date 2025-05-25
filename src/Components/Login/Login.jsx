import React from "react";
import FormLogin from "./FormLogin";
import { Route, Routes } from "react-router-dom";
import styles from "./Login.module.css";
import RecuperarSenha from './RecuperarSenha'
import FormCadastro from "./FormCadastro";
const Login = () => {
  return (
      <div className={styles.login}> 
        <div className={styles.forms}>
          <Routes>
            <Route path="/" element={<FormLogin />} />
            <Route path="recuperar" element={<RecuperarSenha/>}/>
            <Route path="cadastro" element={<FormCadastro/>}/>
          </Routes>
        </div>
      </div>
  );
};

export default Login;
