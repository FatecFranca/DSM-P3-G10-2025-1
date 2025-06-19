import React, { useState, useEffect } from "react";
import styles from "./Comments.module.css";
import UserIcon from "../User/UserIcon";
import commentService from "../../services/commentService";
import { useAuthContext } from "../../context/AuthContext";

const Comments = ({ gameId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, authenticated } = useAuthContext();

  // Buscar comentários reais do backend
  useEffect(() => {
    if (gameId) {
      const fetchComments = async () => {
        setLoading(true);
        const result = await commentService.getCommentsByGameId(gameId);
        if (result.success && Array.isArray(result.data)) {
          setComments(result.data);
        } else {
          setComments([]);
        }
        setLoading(false);
      };
      fetchComments();
    } else {
      setComments([]);
    }
  }, [gameId]);

  // Enviar novo comentário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    const commentData = {
      gameId,
      content: commentText,
      userId: user?.id,
      userName: user?.name,
      userAvatar: user?.avatarUrl,
    };
    const result = await commentService.createComment(commentData);
    if (result.success && result.data) {
      setComments([result.data, ...comments]);
      setCommentText("");
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={`${styles.title} title`}>Comentários</h2>
      {authenticated && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.userLine}>
            <UserIcon initial={user?.name?.charAt(0)?.toUpperCase() || "U"} />
            <span className={styles.userName}>{user?.name || "Usuário"}</span>
          </div>
          <textarea
            className={styles.textarea}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            required
          />
          <button type="submit" disabled={submitting || !commentText.trim()}>
            {submitting ? "Enviando..." : "Comentar"}
          </button>
        </form>
      )}
      <div className={styles.list}>
        {loading ? (
          <p>Carregando comentários...</p>
        ) : comments.length === 0 ? (
          <p className={styles.semComentario}>Nenhum comentário ainda.</p>
        ) : (
          comments.map((c, index) => (
            <div key={c.id || index} className={styles.card}>
              <div className={styles.user}>
                <UserIcon
                  initial={c.userName?.charAt(0)?.toUpperCase() || "U"}
                />
                <div>
                  <strong className={styles.nickname}>
                    {c.userName || "Usuário"}
                  </strong>
                </div>
              </div>
              <p className={styles.comment}>{c.content || "Sem comentário"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
