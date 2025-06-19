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

        // Buscar jogos regulares e em destaque
        const [gamesResult, featuredResult] = await Promise.all([
          gamesService.getGames(),
          gamesService.getFeaturedGames(),
        ]);

        let allGames = [];

        // Adicionar jogos regulares
        if (gamesResult.success && Array.isArray(gamesResult.data)) {
          allGames = [...gamesResult.data];
        }

        // Adicionar jogos em destaque (se não estiverem já na lista)
        if (featuredResult.success && Array.isArray(featuredResult.data)) {
          const featuredGames = featuredResult.data.filter(
            (featuredGame) =>
              !allGames.some((game) => game.id === featuredGame.id)
          );
          allGames = [...allGames, ...featuredGames];
        }

        if (allGames.length > 0) {
          setGames(allGames);
        } else {
          console.error("Nenhum jogo encontrado");
          setGames([]);
          setError("Nenhum jogo disponível no momento");
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
                {" "}
                <div className={styles.gameImage}>
                  <SafeImage
                    src={
                      game.coverUrl ||
                      game.cover_url ||
                      game.imageUrl ||
                      game.image_url ||
                      game.imagem ||
                      game.image
                    }
                    alt={game.title || game.titulo || "Imagem do jogo"}
                    className={styles.gameImageElement}
                    fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjI5MyIgdmlld0JveD0iMCAwIDIyMCAyOTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iMjkzIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMTAgMTMwQzEyMC40NiAxMzAgMTI5IDEyMS40NiAxMjkgMTExQzEyOSAxMDAuNTQgMTIwLjQ2IDkyIDExMCA5MkM5OS41NCA5MiA5MSAxMDAuNTQgOTEgMTExQzkxIDEyMS40NiA5OS41NCAxMzAgMTEwIDEzMFoiIGZpbGw9IiM5N0EzQUYiLz4KPHA+PHBhdGggZD0iTTE1NSAxODBDMTQwIDE3MyAxMTAgMTQwIDExMCAxNzNDMTEwIDE3MyA4MCAxNzMgODAgMTgwSDE1NVoiIGZpbGw9IiM5N0EzQUYiLz4KPHA+PHRleHQgeD0iMTEwIiB5PSIyMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3QTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Sk9HTzwvdGV4dD4KPC9zdmc+Cg=="
                  />
                </div>{" "}
                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>
                    {game.title || game.titulo || "Jogo sem título"}
                  </h3>
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
