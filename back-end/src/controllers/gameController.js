import prisma from '../config/database.js';

export const createGame = async (req, res) => {
  try {
    const { title, description, coverUrl, releaseDate, genreIds } = req.body;

    const game = await prisma.game.create({
      data: {
        title,
        description,
        coverUrl,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        genreIds: genreIds || []
      }
    });

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar jogo' });
  }
};

export const getAllGames = async (req, res) => {
  try {
    const { page = 1, limit = 10, genre } = req.query;
    const skip = (page - 1) * limit;

    const where = genre ? {
      genreIds: {
        has: genre
      }
    } : {};

    const games = await prisma.game.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    // Calcular média de avaliações
    const gamesWithRating = games.map(game => {
      const totalRatings = game.reviews.length;
      const averageRating = totalRatings > 0 
        ? game.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

      return {
        ...game,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: totalRatings,
        reviews: undefined // Remover reviews da resposta
      };
    });

    res.json(gamesWithRating);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
};

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
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    // Calcular estatísticas
    const totalReviews = game.reviews.length;
    const averageRating = totalReviews > 0 
      ? game.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    const gameWithStats = {
      ...game,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews
    };

    res.json(gameWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogo' });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, coverUrl, releaseDate, genreIds } = req.body;

    const game = await prisma.game.update({
      where: { id },
      data: {
        title,
        description,
        coverUrl,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        genreIds
      }
    });

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar jogo' });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.game.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar jogo' });
  }
};