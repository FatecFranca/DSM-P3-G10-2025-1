import React, { useState, useEffect } from "react";
import gamesService from "../../services/gamesService";
import GAME_GENRES from "../../constants/gameGenres";
import { GENRE_MAPPING } from "../../constants/genreMapping";
import ImageUpload from "../Form/ImageUpload";
import SafeImage from "../Helper/SafeImage";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";
import styles from "./GameManager.module.css";

const GameManager = () => {
  const { user } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const { confirm } = useModal();
  const [games, setGames] = useState([]); // Inicializar como array vazio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Adicionar estado de erro
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverUrl: "",
    releaseDate: "",
    genres: [],
    developer: "",
  });

  useEffect(() => {
    loadGames();
  }, []);
  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await gamesService.getGames();

      if (result.success && Array.isArray(result.data)) {
        setGames(result.data);
      } else {
        setGames([]);
        setError("Formato de dados inválido recebido do servidor");
      }
    } catch (error) {
      setGames([]);
      setError(`Erro ao carregar jogos: ${error.message}`);
    }
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (editingGame) {
        result = await gamesService.updateGame(editingGame.id, formData);
      } else {
        const gameData = {
          ...formData,
          createdBy: user?.id || null,
        };
        result = await gamesService.createGame(gameData);
      }
      if (result.success) {
        showSuccess(
          editingGame
            ? "Jogo atualizado com sucesso!"
            : "Jogo criado com sucesso!"
        );
        resetForm();
        loadGames();
      } else {
        showError("Erro: " + result.message);
      }
    } catch (error) {
      showError("Erro ao salvar jogo: " + error.message);
    }
    setLoading(false);
  };
  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      coverUrl: game.coverUrl || "",
      releaseDate: game.releaseDate ? game.releaseDate.split("T")[0] : "",
      genres: game.genres || [],
      developer: game.developer || "",
    });
    setShowForm(true);
  };
  const handleDelete = async (game) => {
    const shouldDelete = await confirm(
      `Tem certeza que deseja deletar "${game.title}"?`,
      "Confirmar Exclusão"
    );

    if (shouldDelete) {
      setLoading(true);
      try {
        const result = await gamesService.deleteGame(game.id);
        if (result.success) {
          showSuccess("Jogo deletado com sucesso!");
          loadGames();
        } else {
          showError("Erro ao deletar jogo: " + result.message);
        }
      } catch (error) {
        showError("Erro ao deletar jogo: " + error.message);
      }
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      coverUrl: "",
      releaseDate: "",
      genres: [],
    });
    setEditingGame(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      genres: checked
        ? [...prev.genres, value]
        : prev.genres.filter((genre) => genre !== value),
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gerenciar Jogos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          {showForm ? "Cancelar" : "Adicionar Jogo"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>{editingGame ? "Editar Jogo" : "Novo Jogo"}</h2>
          <div className={styles.formGroup}>
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>{" "}
          <div className={styles.formGroup}>
            <ImageUpload
              label="Capa do Jogo"
              value={formData.coverUrl}
              onImageUpload={(imageUrl) =>
                setFormData((prev) => ({ ...prev, coverUrl: imageUrl }))
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label>Data de Lançamento</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
            />
          </div>{" "}
          <div className={styles.formGroup}>
            <label>Gêneros</label>
            <div className={styles.genreList}>
              {GAME_GENRES.map((genre) => (
                <label key={genre} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.genres.includes(genre)}
                    onChange={handleGenreChange}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Desenvolvedor</label>
            <input
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : editingGame ? "Atualizar" : "Criar"}
            </button>
            <button type="button" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}{" "}
      <div className={styles.gamesList}>
        <h2>Jogos Cadastrados</h2>

        {error && (
          <div className={styles.errorMessage}>
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : !Array.isArray(games) || games.length === 0 ? (
          <p>Nenhum jogo cadastrado</p>
        ) : (
          <div className={styles.gamesGrid}>
            {games.map((game) => (
              <div key={game.id} className={styles.gameCard}>
                <div className={styles.gameImageContainer}>
                  <SafeImage
                    src={game.coverUrl}
                    alt={game.title}
                    fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQwIDEwMEMxNTUuNDY0IDEwMCAxNjggODcuNDY0IDE2OCA3MkMxNjggNTYuNTM2IDE1NS40NjQgNDQgMTQwIDQ0QzEyNC41MzYgNDQgMTEyIDU2LjUzNiAxMTIgNzJDMTEyIDg3LjQ2NCAxMjQuNTM2IDEwMCAxNDAgMTAwWiIgZmlsbD0iIzk3QTNBRiIvPgo8cGF0aCBkPSJNMjIxIDE1NkMxODQgMTQ0IDEyNCA4NSAxMjQgMTUzQzEyNCAxNTMgNTggMTUzIDU4IDE1NkgyMjFaIiBmaWxsPSIjOTdBM0FGIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTdBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkpvZ288L3RleHQ+Cjwvc3ZnPgo="
                  />
                </div>
                <div className={styles.gameInfo}>
                  {" "}
                  <h3>{game.title}</h3>
                  <p>{game.description}</p> {}
                  {(() => {
                    if (Array.isArray(game.genres) && game.genres.length > 0) {
                      return (
                        <div className={styles.gameGenres}>
                          {game.genres.slice(0, 3).map((genre, index) => (
                            <span key={index} className={styles.genreTag}>
                              {genre}
                            </span>
                          ))}
                          {game.genres.length > 3 && (
                            <span className={styles.genreTag}>
                              +{game.genres.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    } else if (
                      Array.isArray(game.genreIds) &&
                      game.genreIds.length > 0
                    ) {
                      const genreNames = game.genreIds.map(
                        (id) => GENRE_MAPPING[id] || `ID:${id}`
                      );
                      return (
                        <div className={styles.gameGenres}>
                          {genreNames.slice(0, 3).map((genreName, index) => (
                            <span key={index} className={styles.genreTag}>
                              {genreName}
                            </span>
                          ))}
                          {genreNames.length > 3 && (
                            <span className={styles.genreTag}>
                              +{genreNames.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
                  {game.releaseDate && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#95a5a6",
                        marginTop: "0.5rem",
                      }}
                    >
                      📅{" "}
                      {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  <div className={styles.gameActions}>
                    <button onClick={() => handleEdit(game)}>✏️ Editar</button>
                    <button onClick={() => handleDelete(game)}>
                      🗑️ Deletar
                    </button>
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

export default GameManager;
