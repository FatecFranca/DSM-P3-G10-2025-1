import React from "react";
import FormLogin from "./FormLogin";
import { Route, Routes } from "react-router-dom";
import styles from "./Login.module.css";
const Login = () => {
  return (
      <div className={styles.login}> 
        <div className={styles.forms}>
          <Routes>
            <Route path="/" element={<FormLogin />} />
          </Routes>
        </div>
      </div>
  );
};

export default Login;
