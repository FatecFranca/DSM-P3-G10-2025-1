import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar novo jogo
export const createGame = async (req, res) => {
  try {
    const {
      title,
      description,
      coverUrl,
      releaseDate,
      genres,
      developer,
      publisher,
      platform,
    } = req.body;

    // Debug: verificar dados recebidos
    console.log("Dados recebidos no backend para criar jogo:", req.body);
    console.log("Gêneros recebidos:", genres);

    // Validação básica
    if (!title || !description) {
      return res.status(400).json({
        error: "Título e descrição são obrigatórios",
      });
    }

    const game = await prisma.game.create({
      data: {
        title,
        description,
        coverUrl,
        releaseDate: releaseDate ? new Date(releaseDate + "T00:00:00") : null,
        genres: genres || [],
        developer,
        publisher,
        platform: platform || [],
      },
    });

    console.log("Jogo criado:", game);

    res.status(201).json(game);
  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar todos os jogos
export const getAllGames = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, genre } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (genre) {
      where.genres = {
        has: genre,
      };
    }

    const games = await prisma.game.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular média de rating para cada jogo
    const gamesWithStats = games.map((game) => {
      const avgRating =
        game.reviews.length > 0
          ? game.reviews.reduce((sum, review) => sum + review.rating, 0) /
            game.reviews.length
          : 0;

      return {
        ...game,
        averageRating: Math.round(avgRating * 10) / 10,
        reviews: undefined, // Remove reviews detalhadas da resposta
      };
    });

    const total = await prisma.game.count({ where });

    res.json({
      games: gamesWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar jogo por ID
export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ error: "Jogo não encontrado" });
    }

    // Calcular estatísticas
    const avgRating =
      game.reviews.length > 0
        ? game.reviews.reduce((sum, review) => sum + review.rating, 0) /
          game.reviews.length
        : 0;

    const ratingDistribution = {
      5: game.reviews.filter((r) => r.rating === 5).length,
      4: game.reviews.filter((r) => r.rating === 4).length,
      3: game.reviews.filter((r) => r.rating === 3).length,
      2: game.reviews.filter((r) => r.rating === 2).length,
      1: game.reviews.filter((r) => r.rating === 1).length,
    };

    res.json({
      ...game,
      statistics: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: game.reviews.length,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Atualizar jogo
export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      coverUrl,
      releaseDate,
      genres,
      developer,
      publisher,
      platform,
    } = req.body;

    // Debug: verificar dados recebidos
    console.log("Dados recebidos no backend para atualizar jogo:", req.body);
    console.log("Gêneros recebidos:", genres);

    // Verificar se o jogo existe
    const existingGame = await prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      return res.status(404).json({ error: "Jogo não encontrado" });
    }

    const updatedGame = await prisma.game.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(releaseDate && {
          releaseDate: new Date(releaseDate + "T00:00:00"),
        }),
        ...(genres && { genres }),
        ...(developer && { developer }),
        ...(publisher && { publisher }),
        ...(platform && { platform }),
      },
    });

    console.log("Jogo atualizado:", updatedGame);

    res.json(updatedGame);
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Deletar jogo
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o jogo existe
    const existingGame = await prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      return res.status(404).json({ error: "Jogo não encontrado" });
    }

    await prisma.game.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar jogo:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar jogos em destaque (mais bem avaliados)
export const getFeaturedGames = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const games = await prisma.game.findMany({
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Filtrar jogos com pelo menos 3 reviews e calcular média
    const gamesWithRatings = games
      .filter((game) => game.reviews.length >= 3)
      .map((game) => {
        const avgRating =
          game.reviews.reduce((sum, review) => sum + review.rating, 0) /
          game.reviews.length;
        return {
          ...game,
          averageRating: Math.round(avgRating * 10) / 10,
          reviews: undefined,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, parseInt(limit));

    res.json(gamesWithRatings);
  } catch (error) {
    console.error("Erro ao buscar jogos em destaque:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
