import React from "react";
import styles from "./Comments.module.css";
import ReviewForm from "./ReviewForm";
import UserIcon from "../User/UserIcon";

const Comments = ({ avaliacoes }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={`${styles.title} title`}>Avaliações e Comentários</h2>

      <ReviewForm />

      <div className={styles.list}>
        {avaliacoes.length === 0 ? (
          <p className={styles.semComentario}>Nenhum comentário ainda.</p>
        ) : (
          avaliacoes.map((avaliacao, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.user}>
                <UserIcon initial={avaliacao.usuario.charAt(0).toUpperCase()} />
                <div>
                  <strong className={styles.nickname}>
                    {avaliacao.usuario}
                  </strong>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={
                          i < avaliacao.nota ? styles.filled : styles.empty
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className={styles.comment}>{avaliacao.comentario}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
