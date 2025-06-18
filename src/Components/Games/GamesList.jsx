import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gamesService from "../../services/gamesService";
import SafeImage from "../Helper/SafeImage";
import styles from "./GamesList.module.css";

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await gamesService.getGames();

        if (result.success && Array.isArray(result.data)) {
          setGames(result.data);
        } else {
          console.error("Dados de jogos inválidos:", result);
          setGames([]);
          setError("Formato de dados inválido recebido do servidor");
        }
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        setError(
          "Não foi possível carregar a lista de jogos. Por favor, tente novamente mais tarde."
        );
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filtrar jogos com base no termo de pesquisa
  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Catálogo de Jogos</h1>
        <p className={styles.subtitle}>
          Explore nossa coleção completa de jogos
        </p>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </section>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando jogos...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className={styles.gamesGrid}>
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <Link
                to={`/jogo/${game.id}`}
                key={game.id}
                className={styles.gameCard}
              >
                <div className={styles.gameImage}>
                  <SafeImage
                    src={game.coverUrl}
                    alt={game.title}
                    className={styles.gameImageElement}
                  />
                </div>
                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.gameRating}>
                    <span className={styles.starIcon}>★</span>
                    <span>{game.averageRating?.toFixed(1) || "N/A"}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.noGames}>
              {searchTerm
                ? `Nenhum jogo encontrado para "${searchTerm}".`
                : "Nenhum jogo disponível no momento."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GamesList;
