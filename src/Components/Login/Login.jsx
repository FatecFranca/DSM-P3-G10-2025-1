import React from "react";
import FormLogin from "./FormLogin";
import { Route, Routes } from "react-router-dom";
import styles from "./Login.module.css";
import RecuperarSenha from './RecuperarSenha'
import Cadastro from "./Cadastro";
const Login = () => {
  return (
      <div className={styles.login}> 
        <div className={styles.forms}>
          <Routes>
            <Route path="/" element={<FormLogin />} />
            <Route path="recuperar" element={<RecuperarSenha/>}/>
            <Route path="cadastro" element={<Cadastro/>}/>
          </Routes>
        </div>
      </div>
  );
};

export default Login;
