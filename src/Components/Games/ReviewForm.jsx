import React from "react";
import styles from "./ReviewForm.module.css";
import useForm from "../../Hooks/useForm";
import Textarea from "../Form/TextArea";
import Button from "../Form/Button";
const ReviewForm = () => {
  const [notaValue, setNotaValue] = React.useState(0);
  const [error, setError] = React.useState("");
  const comentario = useForm(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (notaValue === 0 || !comentario.validate()) {
      setError("Por favor, preencha todos os campos corretamente.");
      return;
    }
    console.log("Avaliação enviada:", { nota: notaValue, comentario: comentario.value });
    setNotaValue(0);
    setError("");
    comentario.setValue("");
    //Aqui fica logica do backend
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Deixe sua avaliação:</h3>
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => {
          const rating = i + 1;
          return (
            <span
              key={i}
              className={rating <= notaValue ? styles.filled : styles.empty}
              onClick={() => setNotaValue(rating)}
              role="button" 
              aria-label={`${rating} estrelas`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setNotaValue(rating);
              }}
            >
              ★
            </span>
          );
        })}
      </div>
      <Textarea
        label="Comentário"
        name="comentario"
        {...comentario}
        placeholder="Escreva seu comentário..."
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button className={styles.btn}>Enviar</Button>
    </form>
  );
};

export default ReviewForm;
