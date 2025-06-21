import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import gamesService from "../../services/gamesService";
import SafeImage from "../Helper/SafeImage";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import styles from "./GamePage.module.css";
import Detail from "../Detail";
import Reviews from "./Reviews";

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await gamesService.getGame(id);

        if (result.success && result.data) {
          setGame(result.data);
        } else {
          setError("Jogo não encontrado");
        }
      } catch (error) {
        setError("Erro ao carregar os dados do jogo");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando jogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Erro</h2>
        <p>{error}</p>
        <button onClick={() => window.history.back()}>Voltar</button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={styles.error}>
        <h2>Jogo não encontrado</h2>
        <p>O jogo que você está procurando não foi encontrado.</p>
        <button onClick={() => window.history.back()}>Voltar</button>
      </div>
    );
  }
  const getGenresText = () => {
    if (game.genres && Array.isArray(game.genres) && game.genres.length > 0) {
      return game.genres.join(", ");
    }

    if (
      game.genreIds &&
      Array.isArray(game.genreIds) &&
      game.genreIds.length > 0
    ) {
      const genreMapping = {
        "6852287ca44dd65f7a753b4e": "Ação",
        "6852287ca44dd65f7a753b4d": "RPG",
        "6852287ca44dd65f7a753b4f": "Aventura",
        "6852287ca44dd65f7a753b50": "Estratégia",
        "6852287ca44dd65f7a753b51": "FPS",
        "6852287ca44dd65f7a753b52": "Simulação",
        "6852287ca44dd65f7a753b53": "Terror",
        "6852287ca44dd65f7a753b54": "Indie",
        "6852287ca44dd65f7a753b55": "Corrida",
        "6852287ca44dd65f7a753b56": "Esporte",
      };

      const genreNames = game.genreIds.map(
        (id) => genreMapping[id] || `ID:${id}`
      );
      return genreNames.join(", ");
    }

    if (game.genre) return game.genre;
    if (game.genero) return game.genero;

    return "Não informado";
  };

  return (
    <section className={`${styles.container} animeDown`}>
      <div className={styles.info}>
        {" "}
        <div className={styles.imageContainer}>
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
            className={styles.image}
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTcwQzE2MC40NiAxNzAgMTY5IDE2MS40NiAxNjkgMTUxQzE2OSAxNDAuNTQgMTYwLjQ2IDEzMiAxNTAgMTMyQzEzOS41NCAxMzIgMTMxIDE0MC41NCAxMzEgMTUxQzEzMSAxNjEuNDYgMTM5LjU0IDE3MCAxNTAgMTcwWiIgZmlsbD0iIzk3QTNBRiIvPgo8cGF0aCBkPSJNMjEwIDI2OEMxODUgMjU4IDE0NSAyMDAgMTQ1IDI1OEMxNDUgMjU4IDkwIDI1OCA5MCAyNjhIMjEwWiIgZmlsbD0iIzk3QTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTdBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KT0dPPC90ZXh0Pgo8L3N2Zz4K"
          />
          <div className={styles.favoriteButtonContainer}>
            <FavoriteButton game={game} size="medium" />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.header}>
            <h1 className="title">{game.title || game.titulo}</h1>
          </div>
          <p>
            <strong>Gêneros:</strong> {getGenresText()}
          </p>
          <p>
            <strong>Desenvolvedor:</strong>{" "}
            {game.developer || game.desenvolvedor || "Não informado"}
          </p>
          <p>
            <strong>Lançamento:</strong>{" "}
            {game.releaseDate
              ? new Date(game.releaseDate).toLocaleDateString("pt-BR")
              : game.dataLancamento
              ? new Date(game.dataLancamento + "T00:00:00").toLocaleDateString(
                  "pt-BR"
                )
              : "Não informado"}
          </p>{" "}
          {game.averageRating && (
            <p>
              <strong>Avaliação:</strong>
              <span className={styles.rating}>
                ★ {game.averageRating.toFixed(1)}/5
              </span>
            </p>
          )}
          <p className={styles.description}>
            <strong>📖 Descrição:</strong>
            <br />
            <br />
            {game.description ||
              game.descricao ||
              `Este é um exemplo de como uma descrição longa seria exibida no sistema de jogos. 

O layout foi otimizado para suportar textos extensos com scroll personalizado, formatação elegante e uma apresentação visual moderna que mantém a legibilidade mesmo com muito conteúdo. 

O sistema de scroll customizado garante que a experiência do usuário seja fluida e visualmente atrativa, com gradientes roxos que seguem o design system da aplicação.

Características principais:
• Interface moderna e responsiva
• Suporte a textos longos com scroll
• Design consistente em toda aplicação
• Experiência de usuário otimizada            O jogo oferece uma experiência única e envolvente, com gráficos impressionantes e jogabilidade inovadora que cativa jogadores de todas as idades.`}
          </p>
        </div>
      </div>

      <Reviews gameId={game.id} />

      <Detail />
    </section>
  );
};

export default GamePage;
