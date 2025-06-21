import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testFavorite() {
  try {
    console.log("🔍 Testando modelo Favorite...");

    const favoriteModel = prisma.favorite;
    console.log("✅ Modelo Favorite existe:", favoriteModel !== undefined);

    console.log("📊 Contando favoritos...");
    const count = await prisma.favorite.count();
    console.log("✅ Total de favoritos:", count);
  } catch (error) {
    console.error("❌ Erro ao testar Favorite:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testFavorite();
