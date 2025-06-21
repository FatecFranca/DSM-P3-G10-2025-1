import prisma from "../database/client.js";

export const createGenre = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validação básica
    if (!name) {
      return res.status(400).json({
        error: "Nome é obrigatório",
      });
    }

    // Verificar se o gênero já existe
    const existingGenre = await prisma.genre.findUnique({
      where: { name },
    });

    if (existingGenre) {
      return res.status(400).json({
        error: "Gênero já existe",
      });
    }

    const genre = await prisma.genre.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(genre);
  } catch (error) {
    console.error("Erro ao criar gênero:", error);
    res.status(500).json({ error: "Erro ao criar gênero" });
  }
};

export const getAllGenres = async (req, res) => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(genres);
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error);
    res.status(500).json({ error: "Erro ao buscar gêneros" });
  }
};
export const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;

    const genre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }

    // Buscar jogos deste gênero
    const games = await prisma.game.findMany({
      where: {
        genreIds: {
          has: id,
        },
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const gamesWithRatings = games.map((game) => {
      const avgRating =
        game.reviews.length > 0
          ? game.reviews.reduce((sum, review) => sum + review.rating, 0) /
            game.reviews.length
          : 0;

      return {
        ...game,
        averageRating: Math.round(avgRating * 10) / 10,
        reviews: undefined,
      };
    });

    res.json({
      ...genre,
      gameCount: games.length,
      games: gamesWithRatings,
    });
  } catch (error) {
    console.error("Erro ao buscar gênero:", error);
    res.status(500).json({ error: "Erro ao buscar gênero" });
  }
};

// Buscar gênero por slug (nova função)
export const getGenreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Converter slug para nome (assumindo que slug é o nome em lowercase com hífens)
    const genreName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const genre = await prisma.genre.findFirst({
      where: {
        name: {
          equals: genreName,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    if (!genre) {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }

    // Buscar jogos deste gênero
    const games = await prisma.game.findMany({
      where: {
        genreIds: {
          has: genre.id,
        },
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const gamesWithRatings = games.map((game) => {
      const avgRating =
        game.reviews.length > 0
          ? game.reviews.reduce((sum, review) => sum + review.rating, 0) /
            game.reviews.length
          : 0;

      return {
        ...game,
        averageRating: Math.round(avgRating * 10) / 10,
        reviews: undefined,
      };
    });

    res.json({
      ...genre,
      slug,
      games: gamesWithRatings,
    });
  } catch (error) {
    console.error("Erro ao buscar gênero por slug:", error);
    res.status(500).json({ error: "Erro ao buscar gênero" });
  }
};

export const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Nome é obrigatório",
      });
    }

    // Verificar se o gênero existe
    const existingGenre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }

    // Verificar se o novo nome já existe (exceto para o próprio gênero)
    const nameExists = await prisma.genre.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (nameExists) {
      return res.status(400).json({
        error: "Nome já está em uso",
      });
    }

    const updatedGenre = await prisma.genre.update({
      where: { id },
      data: { name, description },
    });

    res.json(updatedGenre);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }
    console.error("Erro ao atualizar gênero:", error);
    res.status(500).json({ error: "Erro ao atualizar gênero" });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se há jogos associados ao gênero
    const gamesCount = await prisma.game.count({
      where: {
        genreIds: {
          has: id,
        },
      },
    });

    if (gamesCount > 0) {
      return res.status(400).json({
        error: "Não é possível excluir gênero que possui jogos associados",
      });
    }

    // Verificar se o gênero existe
    const existingGenre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }

    await prisma.genre.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }
    console.error("Erro ao deletar gênero:", error);
    res.status(500).json({ error: "Erro ao deletar gênero" });
  }
};

// Buscar gêneros populares (com mais jogos)
export const getPopularGenres = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    // Ordenar por número de jogos (descendente)
    const popularGenres = genres
      .sort((a, b) => b._count.games - a._count.games)
      .slice(0, parseInt(limit));

    res.json(popularGenres);
  } catch (error) {
    console.error("Erro ao buscar gêneros populares:", error);
    res.status(500).json({ error: "Erro ao buscar gêneros populares" });
  }
};

// Buscar gêneros com estatísticas detalhadas
export const getGenreStats = async (req, res) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    // Calcular estatísticas para cada gênero
    const genreStats = await Promise.all(
      genres.map(async (genre) => {
        // Buscar todos os jogos do gênero
        const games = await prisma.game.findMany({
          where: {
            genreIds: {
              has: genre.id,
            },
          },
          include: {
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        });

        // Calcular média de rating dos jogos do gênero
        let totalRatings = 0;
        let totalReviews = 0;

        games.forEach((game) => {
          if (game.reviews.length > 0) {
            const gameAvg =
              game.reviews.reduce((sum, review) => sum + review.rating, 0) /
              game.reviews.length;
            totalRatings += gameAvg;
            totalReviews += game.reviews.length;
          }
        });

        const averageRating =
          games.length > 0 ? totalRatings / games.length : 0;

        return {
          ...genre,
          statistics: {
            totalGames: games.length,
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
          },
        };
      })
    );

    res.json(genreStats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas dos gêneros:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas dos gêneros" });
  }
};

// Pesquisar gêneros por nome
export const searchGenres = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: "Termo de busca deve ter pelo menos 2 caracteres",
      });
    }

    const genres = await prisma.genre.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q.trim(),
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q.trim(),
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        _count: {
          select: { games: true },
        },
      },
      take: parseInt(limit),
      orderBy: { name: "asc" },
    });

    res.json({
      genres,
      searchTerm: q.trim(),
      total: genres.length,
    });
  } catch (error) {
    console.error("Erro ao pesquisar gêneros:", error);
    res.status(500).json({ error: "Erro ao pesquisar gêneros" });
  }
};

