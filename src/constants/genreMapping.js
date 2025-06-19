// Mapeamento simples e direto de IDs para nomes de gêneros
export const GENRE_MAPPING = {
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

export const getGenreNames = (genreIds) => {
  if (!genreIds || !Array.isArray(genreIds)) return "Não informado";

  const names = genreIds
    .map((id) => GENRE_MAPPING[id] || `ID:${id}`)
    .filter((name) => name);

  return names.length > 0 ? names.join(", ") : "Não informado";
};
