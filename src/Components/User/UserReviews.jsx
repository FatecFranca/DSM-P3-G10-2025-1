import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { getReviewsByUser } from "../../services/reviewsServiceNew";
import styles from "./UserReviews.module.css";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserReviews = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError("");

      try {
        const response = await getReviewsByUser(user.id);
        if (response.success) {
          setReviews(response.data);
        } else {
          setError("Erro ao carregar reviews");
        }
      } catch (error) {
        console.error("Erro ao carregar reviews do usuário:", error);
        setError("Erro ao carregar reviews");
      } finally {
        setLoading(false);
      }
    };

    loadUserReviews();
  }, [user?.id]);

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <span
          key={i}
          className={
            i < Math.floor(rating) ? styles.starFilled : styles.starEmpty
          }
        >
          ★
        </span>
      ));
  };

  if (loading) {
    return (
      <div className={styles.userReviews}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando suas reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.userReviews}>
        <div className={styles.errorContainer}>
          <span className={styles.errorIcon}>❌</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userReviews}>
      <div className={styles.reviewsContainer}>
        <div className={styles.reviewsHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Minhas Reviews</h1>
            <p className={styles.subtitle}>
              Suas avaliações e opiniões sobre jogos
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>Nenhuma review publicada ainda</h3>
            <p>
              Que tal compartilhar sua opinião sobre um jogo que você jogou
              recentemente?
            </p>
          </div>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div
                    className={styles.gameInfo}
                    onClick={() => navigate(`/jogo/${review.game?.id}`)}
                  >
                    <img
                      src={review.game?.coverUrl || "/placeholder-game.jpg"}
                      alt={review.game?.title}
                      className={styles.gameThumb}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x100/1e293b/cbd5e1?text=Game";
                      }}
                    />
                    <div className={styles.gameDetails}>
                      <h4 className={styles.gameTitle}>{review.game?.title}</h4>
                      <div className={styles.reviewRating}>
                        {renderStars(review.rating)}
                        <span className={styles.ratingNumber}>
                          ({review.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.reviewContent}>
                  <p className={styles.reviewText}>
                    {review.comment?.length > 300
                      ? `${review.comment.substring(0, 300)}...`
                      : review.comment}
                  </p>
                </div>

                <div className={styles.reviewFooter}>
                  <div className={styles.reviewStats}>
                    <span className={styles.stat}>
                      <span className={styles.statIcon}>👍</span>
                      {review._count?.reactions?.LIKE || review.likes || 0}
                    </span>
                    <span className={styles.stat}>
                      <span className={styles.statIcon}>👎</span>
                      {review._count?.reactions?.DISLIKE ||
                        review.dislikes ||
                        0}
                    </span>
                  </div>

                  <div className={styles.reviewMeta}>
                    <span className={styles.publishDate}>
                      {new Date(review.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;

