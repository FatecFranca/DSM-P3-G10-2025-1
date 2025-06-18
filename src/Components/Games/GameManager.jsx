import React, { useState, useEffect } from "react";
import gamesService from "../../services/gamesService";
import genresService from "../../services/genresService";
import ImageUpload from "../Form/ImageUpload";
import SafeImage from "../Helper/SafeImage";
import styles from "./GameManager.module.css";

const GameManager = () => {
  const [games, setGames] = useState([]); // Inicializar como array vazio
  const [genres, setGenres] = useState([]); // Inicializar como array vazio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Adicionar estado de erro
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverUrl: "",
    releaseDate: "",
    genreIds: [],
  });

  useEffect(() => {
    loadGames();
    loadGenres();
  }, []);
  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Carregando jogos...");
      const result = await gamesService.getGames();
      console.log("Resultado da busca de jogos:", result);

      if (result.success && Array.isArray(result.data)) {
        setGames(result.data);
      } else {
        console.error("Dados de jogos inválidos:", result);
        setGames([]); // Garantir que games sempre seja um array
        setError("Formato de dados inválido recebido do servidor");
      }
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
      setGames([]); // Em caso de erro, definir como array vazio
      setError(`Erro ao carregar jogos: ${error.message}`);
    }
    setLoading(false);
  };
  const loadGenres = async () => {
    try {
      const result = await genresService.getGenres();
      if (result.success && Array.isArray(result.data)) {
        setGenres(result.data);
      } else {
        console.error("Dados de gêneros inválidos:", result);
        setGenres([]); // Garantir que genres sempre seja um array
      }
    } catch (error) {
      console.error("Erro ao carregar gêneros:", error);
      setGenres([]); // Em caso de erro, definir como array vazio
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (editingGame) {
        result = await gamesService.updateGame(editingGame.id, formData);
      } else {
        result = await gamesService.createGame(formData);
      }

      if (result.success) {
        alert(
          editingGame
            ? "Jogo atualizado com sucesso!"
            : "Jogo criado com sucesso!"
        );
        resetForm();
        loadGames();
      } else {
        alert("Erro: " + result.message);
      }
    } catch (error) {
      alert("Erro ao salvar jogo: " + error.message);
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
      genreIds: game.genreIds || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (game) => {
    if (window.confirm(`Tem certeza que deseja deletar "${game.title}"?`)) {
      setLoading(true);
      try {
        const result = await gamesService.deleteGame(game.id);
        if (result.success) {
          alert("Jogo deletado com sucesso!");
          loadGames();
        } else {
          alert("Erro ao deletar jogo: " + result.message);
        }
      } catch (error) {
        alert("Erro ao deletar jogo: " + error.message);
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
      genreIds: [],
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
      genreIds: checked
        ? [...prev.genreIds, value]
        : prev.genreIds.filter((id) => id !== value),
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
          </div>
          <div className={styles.formGroup}>
            <label>Gêneros</label>
            <div className={styles.genreList}>
              {genres.map((genre) => (
                <label key={genre.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={genre.id}
                    checked={formData.genreIds.includes(genre.id)}
                    onChange={handleGenreChange}
                  />
                  {genre.name}
                </label>
              ))}
            </div>
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
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>

                  {Array.isArray(game.genreIds) && game.genreIds.length > 0 && (
                    <div className={styles.gameGenres}>
                      {game.genreIds.slice(0, 3).map((genreId, index) => {
                        const genre = Array.isArray(genres)
                          ? genres.find((g) => g.id === genreId)
                          : null;
                        return genre ? (
                          <span key={index} className={styles.genreTag}>
                            {genre.name || genreId}
                          </span>
                        ) : null;
                      })}
                      {game.genreIds.length > 3 && (
                        <span className={styles.genreTag}>
                          +{game.genreIds.length - 3}
                        </span>
                      )}
                    </div>
                  )}

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
