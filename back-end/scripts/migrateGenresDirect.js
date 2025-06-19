// Script direto para MongoDB - migração de gêneros
import { MongoClient } from "mongodb";

// Mapeamento de IDs para nomes
const GENRE_MAPPING = {
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

async function migrateGenres() {
  const client = new MongoClient(process.env.DATABASE_URL);

  try {
    await client.connect();
    console.log("🚀 Conectado ao MongoDB");

    const db = client.db();
    const games = db.collection("games");

    // Buscar todos os jogos
    const allGames = await games.find({}).toArray();
    console.log(`📋 Encontrados ${allGames.length} jogos`);

    for (const game of allGames) {
      let genres = [];

      // Se tem genreIds, converter para nomes
      if (game.genreIds && game.genreIds.length > 0) {
        genres = game.genreIds.map((id) => GENRE_MAPPING[id] || `ID:${id}`);
        console.log(`🎮 ${game.title}: ${game.genreIds} → ${genres}`);
      }

      // Atualizar o jogo
      await games.updateOne(
        { _id: game._id },
        {
          $set: { genres: genres },
          $unset: { genreIds: "" }, // Remove o campo antigo
        }
      );
    }

    console.log("✅ Migração concluída!");
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await client.close();
  }
}

migrateGenres();
