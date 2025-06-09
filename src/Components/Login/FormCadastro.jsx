import React from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Form/Input";
import Button from "../Form/Button";
import styles from "./FormCadastro.module.css";
import useForm from "../../hooks/useForm";
import { useUser } from "../../context/UserContext";

const FormCadastro = () => {
  const name = useForm("");
  const email = useForm("email");
  const password = useForm("");
  const navigate = useNavigate();
  const { register } = useUser();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!name.validate() || !email.validate() || !password.validate()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(name.value, email.value, password.value);
      navigate("/conta");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={`${styles.content} animedown`}>
      <h1 className="title">Cadastro</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Nome Completo" type="text" name="name" {...name} />
        <Input label="E-mail" type="email" name="email" {...email} />
        <Input label="Senha" type="password" name="password" {...password} />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <Button disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </section>
  );
};

export default FormCadastro;