import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log("🌱 Criando dados de teste...");

    // Criar usuário de teste
    const user = await prisma.user.create({
      data: {
        name: "Usuário Teste",
        email: "teste@exemplo.com",
        password: "$2b$10$dummypassword", // Senha fake para teste
        username: "usuarioteste",
        bio: "Usuário para teste do sistema de reviews",
      },
    });
    console.log("✅ Usuário criado:", user);

    // Criar jogo de teste
    const game = await prisma.game.create({
      data: {
        title: "Jogo de Teste",
        description: "Um jogo incrível para testar o sistema de reviews",
        coverUrl: "https://via.placeholder.com/300x400",
        developer: "Desenvolvedor Teste",
        publisher: "Publisher Teste",
        platform: ["PC", "PlayStation", "Xbox"],
        genres: ["Ação", "Aventura"],
      },
    });
    console.log("✅ Jogo criado:", game);

    console.log("🎉 Dados de teste criados com sucesso!");
    console.log("🎮 Game ID:", game.id);
    console.log("👤 User ID:", user.id);
  } catch (error) {
    console.error("❌ Erro ao criar dados de teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
