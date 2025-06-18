import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const commonGenres = [
  { name: "Ação", description: "Jogos com foco em combate e desafios físicos" },
  { name: "Aventura", description: "Jogos com narrativa e exploração" },
  {
    name: "RPG",
    description: "Role-playing games com desenvolvimento de personagem",
  },
  {
    name: "Estratégia",
    description: "Jogos que requerem planejamento e táticas",
  },
  {
    name: "Simulação",
    description: "Jogos que simulam atividades da vida real",
  },
  { name: "Esportes", description: "Jogos baseados em esportes" },
  { name: "Corrida", description: "Jogos de corrida e veículos" },
  { name: "Puzzle", description: "Jogos de quebra-cabeça e lógica" },
  { name: "Plataforma", description: "Jogos com pulos e obstáculos" },
  { name: "Luta", description: "Jogos de combate um contra um" },
  { name: "Tiro", description: "First-person e third-person shooters" },
  { name: "Horror", description: "Jogos de terror e suspense" },
  { name: "Indie", description: "Jogos independentes" },
  { name: "Casual", description: "Jogos casuais e fáceis de jogar" },
  {
    name: "MMORPG",
    description: "Massively multiplayer online role-playing games",
  },
];

async function seedGenres() {
  console.log("🌱 Populando gêneros...");

  for (const genre of commonGenres) {
    try {
      // Verificar se já existe
      const existing = await prisma.genre.findUnique({
        where: { name: genre.name },
      });

      if (!existing) {
        await prisma.genre.create({
          data: genre,
        });
        console.log(`✅ Gênero criado: ${genre.name}`);
      } else {
        console.log(`⏭️  Gênero já existe: ${genre.name}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao criar gênero ${genre.name}:`, error);
    }
  }

  console.log("🎉 Finalizado!");
  await prisma.$disconnect();
}

seedGenres().catch((error) => {
  console.error("Erro ao popular gêneros:", error);
  process.exit(1);
});
