// Mapeamento estático de gêneros - muito mais eficiente que API
export const GENRES_MAP = {
  // IDs comuns que podem vir do backend
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
  "6852287ca44dd65f7a753b57": "Puzzle",
  "6852287ca44dd65f7a753b58": "Plataforma",
  "6852287ca44dd65f7a753b59": "Luta",
  "6852287ca44dd65f7a753b5a": "Arcade",
  "6852287ca44dd65f7a753b5b": "Musical",
};

// Lista de gêneros padrão para fallback
export const DEFAULT_GENRES = [
  "Ação",
  "RPG",
  "Aventura",
  "Estratégia",
  "FPS",
  "Simulação",
  "Terror",
  "Indie",
  "Corrida",
  "Esporte",
  "Puzzle",
  "Plataforma",
  "Luta",
  "Arcade",
  "Musical",
  "MMO",
  "Battle Royale",
  "Sandbox",
  "Survival",
  "Roguelike",
];

// Função para converter IDs em nomes de gêneros
export const getGenreNames = (genreIds) => {
  if (!genreIds || !Array.isArray(genreIds)) {
    return "Não informado";
  }

  const genreNames = genreIds
    .map((id) => GENRES_MAP[id] || `Gênero ${id}`)
    .filter(Boolean);

  return genreNames.length > 0 ? genreNames.join(", ") : "Não informado";
};

// Função para validar se um gênero existe
export const isValidGenre = (genre) => {
  return DEFAULT_GENRES.includes(genre);
};

