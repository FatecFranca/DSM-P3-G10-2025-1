import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Reviews.module.css";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../services/reviewsServiceNew";

const Reviews = ({ gameId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authenticated } = useAuthContext();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    loadReviews();
  }, [gameId]);
  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(gameId);
      setReviews(data);
    } catch (error) {
      console.error("Erro ao carregar reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0 || !comment.trim()) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (!user) {
      alert("Você precisa estar logado para avaliar!");
      return;
    }

    setSubmitting(true);
    try {
      // Verificar se usuário já tem review
      const existingReview = reviews.find(
        (r) => r.userId === user.id || r.user?.id === user.id
      );

      if (existingReview) {
        // Se já tem review, perguntar se quer sobrescrever
        const shouldOverwrite = confirm(
          "Você já criou uma review sobre este jogo. Deseja sobrescrever ela?"
        );

        if (!shouldOverwrite) {
          setSubmitting(false);
          return;
        }

        // Se confirmou, atualizar automaticamente
        const reviewData = {
          rating: rating,
          comment: comment.trim(),
        };

        const updatedReview = await updateReview(existingReview.id, reviewData);

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === existingReview.id
              ? {
                  ...review,
                  rating: rating,
                  comment: comment.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : review
          )
        );

        // Reset form
        setRating(0);
        setComment("");

        alert("Sua avaliação foi atualizada com sucesso!");
      } else {
        // Se não tem review, criar novo
        const reviewData = {
          gameId: gameId,
          userId: user.id,
          rating: rating,
          comment: comment.trim(),
        };

        const newReview = await createReview(reviewData);

        // Adiciona no topo da lista
        setReviews((prevReviews) => [newReview, ...prevReviews]);

        // Reset form
        setRating(0);
        setComment("");

        alert("Avaliação enviada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao enviar review:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    if (editRating === 0 || !editComment.trim()) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        rating: editRating,
        comment: editComment.trim(), // Agora backend espera 'comment' corretamente
      };
      const updatedReview = await updateReview(editingReview.id, reviewData);

      setReviews((prevReviews) => {
        const newReviews = prevReviews.map((review) =>
          review.id === editingReview.id
            ? {
                ...review,
                rating: editRating,
                comment: editComment.trim(),
                updatedAt: new Date().toISOString(),
              }
            : review
        );
        return newReviews;
      });

      setEditingReview(null);
      setEditRating(0);
      setEditComment("");

      alert("Avaliação atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar review:", error);
      alert("Erro ao atualizar avaliação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Função para deletar review
  const handleDeleteReview = async (reviewId) => {
    const shouldDelete = confirm(
      "Tem certeza que deseja deletar sua avaliação?"
    );
    if (!shouldDelete) return;

    try {
      await deleteReview(reviewId);

      // Remove da lista
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );

      alert("Avaliação deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar review:", error);
      alert("Erro ao deletar avaliação. Tente novamente.");
    }
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment("");
  };

  if (loading) {
    return <div>Carregando reviews...</div>;
  }
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>⭐ Avaliações dos Usuários</h3>
      {/* Formulário de Nova Avaliação */}
      {user ? (
        <div className={styles.reviewFormSection}>
          <h4>✨ Deixe sua avaliação</h4>
          <form onSubmit={handleSubmitReview}>
            {/* Sistema de Estrelas */}
            <div className={styles.stars}>
              <span className={styles.starLabel}>Sua nota:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${
                    star <= rating ? styles.starFilled : styles.starEmpty
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
              {rating > 0 && (
                <span className={styles.ratingDisplay}>({rating}/5)</span>
              )}
            </div>
            {/* Campo de Comentário */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva seu comentário sobre o jogo..."
              rows="4"
              className={styles.commentTextarea}
            />
            {/* Botão Enviar */}{" "}
            <button
              type="submit"
              disabled={submitting}
              className={styles.submitButton}
            >
              {submitting ? "✨ Enviando..." : "🚀 Enviar Avaliação"}
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.reviewFormSection}>
          <p>🔐 Faça login para deixar sua avaliação!</p>
        </div>
      )}

      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            {" "}
            <div className={styles.reviewHeader}>
              <span className={styles.username}>
                👤{" "}
                {review.user?.name ||
                  review.user?.username ||
                  "Usuário anônimo"}
              </span>
              <div className={styles.rating}>
                {" "}
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < review.rating
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  >
                    ★
                  </span>
                ))}
                <span className={styles.ratingText}>({review.rating}/5)</span>
              </div>
            </div>
            {/* Conteúdo - mostra formulário de edição ou comentário normal */}
            {editingReview && editingReview.id === review.id ? (
              <div className={styles.editFormInline}>
                <h4>✏️ Editando Avaliação</h4>
                <form onSubmit={handleUpdateReview}>
                  {" "}
                  {/* Sistema de Estrelas para edição */}
                  <div className={styles.editStars}>
                    <span className={styles.starLabel}>Sua nota:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${styles.star} ${
                          star <= editRating
                            ? styles.starFilled
                            : styles.starEmpty
                        }`}
                        onClick={() => setEditRating(star)}
                      >
                        ★
                      </span>
                    ))}
                    {editRating > 0 && (
                      <span className={styles.ratingDisplay}>
                        ({editRating}/5)
                      </span>
                    )}
                  </div>
                  {/* Campo de edição do comentário */}
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Escreva seu comentário sobre o jogo..."
                    className={styles.editTextarea}
                    rows="3"
                  />
                  {/* Botões de ação inline */}
                  <div className={styles.editActionsInline}>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={styles.updateButtonInline}
                    >
                      {submitting ? "💾 Salvando..." : "💾 Salvar"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={styles.cancelButtonInline}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className={styles.reviewContent}>
                  <p>{review.comment}</p>
                </div>
                <div className={styles.reviewDate}>
                  📅 {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </div>{" "}
                {user &&
                  (user.id === review.userId ||
                    user.id === review.user?.id) && (
                    <div className={styles.reviewActions}>
                      {" "}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingReview(review);
                          setEditRating(review.rating);
                          setEditComment(review.comment);
                        }}
                        className={styles.editButton}
                        type="button"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className={styles.deleteButton}
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
