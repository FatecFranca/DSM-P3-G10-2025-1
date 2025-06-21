// Script para migrar genreIds para genres (strings)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapeamento de IDs para nomes (baseado nos IDs que apareceram no console)
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
  try {
    console.log("🚀 Iniciando migração de gêneros...");

    // Buscar todos os jogos
    const games = await prisma.game.findMany();
    console.log(`📋 Encontrados ${games.length} jogos`);

    for (const game of games) {
      let genres = [];

      // Se tem genreIds, converter para nomes
      if (game.genreIds && game.genreIds.length > 0) {
        genres = game.genreIds.map((id) => GENRE_MAPPING[id] || `ID:${id}`);
        console.log(`🎮 ${game.title}: ${game.genreIds} → ${genres}`);
      }

      // Atualizar o jogo com os novos gêneros
      await prisma.game.update({
        where: { id: game.id },
        data: {
          genres: genres,
          // Remover genreIds não é necessário agora, o Prisma vai ignorar
        },
      });
    }

    console.log("✅ Migração concluída com sucesso!");
    console.log(
      "ℹ️  Agora você pode executar o Prisma migrate para aplicar as mudanças no schema"
    );
  } catch (error) {
    console.error("❌ Erro na migração:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração
migrateGenres();

