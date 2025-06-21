import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Reviews.module.css";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../services/reviewsServiceNew";
import reactionService from "../../services/reactionService";

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
  const [reviewReactions, setReviewReactions] = useState({});
  useEffect(() => {
    loadReviews();
  }, [gameId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(gameId);
      setReviews(data);

      // Carregar reações para cada review
      const reactionsData = {};
      for (const review of data) {
        const result = await reactionService.getReviewReactions(review.id);
        if (result.success) {
          reactionsData[review.id] = result.data;
        }
      }
      setReviewReactions(reactionsData);
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
  }; // Função para reagir a uma review
  const handleReaction = async (reviewId, type) => {
    console.log("Clicou na reação:", reviewId, type, "User:", user);

    if (!user) {
      alert("Você precisa estar logado para reagir!");
      return;
    }

    try {
      const result = await reactionService.reactToReviewWithUser(
        reviewId,
        type,
        user.id
      );
      if (result.success) {
        console.log("Reação criada com sucesso:", result.data);
        // Recarregar reações da review
        const reactionsResult = await reactionService.getReviewReactions(
          reviewId
        );
        if (reactionsResult.success) {
          console.log("Reações recarregadas:", reactionsResult.data);
          setReviewReactions((prev) => ({
            ...prev,
            [reviewId]: reactionsResult.data,
          }));
        }
      } else {
        console.error("Erro no resultado:", result.message);
        alert("Erro ao reagir: " + result.message);
      }
    } catch (error) {
      console.error("Erro ao reagir:", error);
      alert("Erro ao reagir. Tente novamente.");
    }
  };

  // Função para verificar se usuário já reagiu
  const getUserReaction = (reviewId) => {
    const reactions = reviewReactions[reviewId];
    if (!reactions || !user) return null;

    return reactions.reactions?.find((r) => r.userId === user.id);
  };

  // Função para contar reações
  const getReactionCounts = (reviewId) => {
    const reactions = reviewReactions[reviewId];
    if (!reactions) return { likes: 0, dislikes: 0 };

    return {
      likes: reactions.summary?.likes || 0,
      dislikes: reactions.summary?.dislikes || 0,
    };
  };

  if (loading) {
    return <div>Carregando reviews...</div>;
  }
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>⭐ Avaliações dos Usuários</h3>
      {}
      {user ? (
        <div className={styles.reviewFormSection}>
          <h4>✨ Deixe sua avaliação</h4>
          <form onSubmit={handleSubmitReview}>
            {}
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
            {}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva seu comentário sobre o jogo..."
              rows="4"
              className={styles.commentTextarea}
            />
            {}{" "}
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
            {}
            {editingReview && editingReview.id === review.id ? (
              <div className={styles.editFormInline}>
                <h4>✏️ Editando Avaliação</h4>
                <form onSubmit={handleUpdateReview}>
                  {" "}
                  {}
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
                  {}
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Escreva seu comentário sobre o jogo..."
                    className={styles.editTextarea}
                    rows="3"
                  />
                  {}
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
                {" "}
                <div className={styles.reviewContent}>
                  <p>{review.comment}</p>
                </div>
                {}
                <div className={styles.reactionsSection}>
                  {user ? (
                    <div className={styles.reactionButtons}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Clique no like detectado!");
                          handleReaction(review.id, "LIKE");
                        }}
                        className={`${styles.reactionButton} ${
                          getUserReaction(review.id)?.type === "LIKE"
                            ? styles.reactionActive
                            : ""
                        }`}
                        type="button"
                      >
                        👍 {getReactionCounts(review.id).likes}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Clique no dislike detectado!");
                          handleReaction(review.id, "DISLIKE");
                        }}
                        className={`${styles.reactionButton} ${
                          getUserReaction(review.id)?.type === "DISLIKE"
                            ? styles.reactionActive
                            : ""
                        }`}
                        type="button"
                      >
                        👎 {getReactionCounts(review.id).dislikes}
                      </button>
                    </div>
                  ) : (
                    <div className={styles.reactionDisplay}>
                      <span className={styles.reactionCount}>
                        👍 {getReactionCounts(review.id).likes}
                      </span>
                      <span className={styles.reactionCount}>
                        👎 {getReactionCounts(review.id).dislikes}
                      </span>
                    </div>
                  )}
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

