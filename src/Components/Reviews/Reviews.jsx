import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Review.module.css"; // Corrigido para o nome correto do arquivo CSS
import Detail from "../Detail";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("recentes");

  useEffect(() => {
    // Simulação de carregamento de dados
    // Futuramente substituir por chamada à API
    setTimeout(() => {
      setReviews(reviewsMock);
      setLoading(false);
    }, 800);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // Aqui você pode implementar a lógica de filtro real
  };

  return (
    <main className={styles.reviewsPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.pageTitle}>Reviews de Jogos</h1>
          <p className={styles.pageDescription}>
            Análises detalhadas e honestas dos jogos mais aguardados e populares.
            Nossas reviews são baseadas em uma avaliação cuidadosa de gameplay,
            história, gráficos e muito mais.
          </p>
        </div>
      </section>

      <section className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.filterOptions}>
            <button 
              className={`${styles.filterBtn} ${filter === "recentes" ? styles.active : ""}`}
              onClick={() => handleFilterChange("recentes")}
            >
              Mais Recentes
            </button>
            <button 
              className={`${styles.filterBtn} ${filter === "populares" ? styles.active : ""}`}
              onClick={() => handleFilterChange("populares")}
            >
              Mais Populares
            </button>
            <button 
              className={`${styles.filterBtn} ${filter === "melhor" ? styles.active : ""}`}
              onClick={() => handleFilterChange("melhor")}
            >
              Melhor Avaliados
            </button>
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection}>
        <div className={styles.sectionHeader}>
          <h2>Todas as Reviews</h2>
          <Detail />
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando reviews...</div>
        ) : (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <Link 
                to={`/jogo/${review.gameId}`} 
                className={styles.reviewCard} 
                key={review.id}
              >
                <div className={styles.reviewImage}>
                  <img src={review.gameCover} alt={review.gameTitle} />
                  <div className={styles.reviewScore}>{review.score}</div>
                </div>
                <div className={styles.reviewContent}>
                  <h3 className={styles.reviewTitle}>{review.gameTitle}</h3>
                  <p className={styles.reviewExcerpt}>{review.excerpt}</p>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewDate}>
                      {review.date}
                    </span>
                    <span className={styles.reviewAuthor}>
                      por {review.author}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

// Dados mockados para testes
const reviewsMock = [
  {
    id: 1,
    gameId: 1,
    gameTitle: "The Witcher 3: Wild Hunt",
    gameCover: "./assets/1.jpg",
    score: "9.8",
    excerpt: "Uma obra-prima que redefiniu o gênero RPG com um mundo vasto e histórias memoráveis.",
    author: "Carlos Silva",
    date: "20/05/2023"
  },
  {
    id: 2,
    gameId: 2,
    gameTitle: "Doom The Dark Ages",
    gameCover: "./assets/2.jpg",
    score: "8.7",
    excerpt: "Uma reimaginação brutal e frenética que mistura o caos do DOOM com um mundo medieval sombrio.",
    author: "Marina Costa",
    date: "12/06/2023"
  },
  {
    id: 3,
    gameId: 3,
    gameTitle: "GTA VI",
    gameCover: "./assets/3.jpg",
    score: "9.5",
    excerpt: "O novo capítulo da franquia GTA eleva o padrão de mundos abertos mais uma vez.",
    author: "Rafael Mendes",
    date: "30/04/2023"
  }
];

export default Reviews;