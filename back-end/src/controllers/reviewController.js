import prisma from '../database/client.js';

// Criar nova review
export const createReview = async (req, res) => {
  try {
    const { rating, comment, userId, gameId } = req.body;

    // Validação básica
    if (!rating || !comment || !userId || !gameId) {
      return res.status(400).json({
        error: 'Rating, comment, userId e gameId são obrigatórios'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating deve estar entre 1 e 5'
      });
    }

    // Verificar se o usuário já fez review para este jogo
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        gameId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        error: 'Usuário já fez review para este jogo'
      });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId,
        gameId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            coverUrl: true
          }
        }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Erro ao criar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar todas as reviews
export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, gameId, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (gameId) where.gameId = gameId;
    if (userId) where.userId = userId;

    const reviews = await prisma.review.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            coverUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.review.count({ where });

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar review por ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            coverUrl: true
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review não encontrada' });
    }

    res.json(review);
  } catch (error) {
    console.error('Erro ao buscar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Verificar se a review existe
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review não encontrada' });
    }

    // Validação
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        error: 'Rating deve estar entre 1 e 5'
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(comment && { comment })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            coverUrl: true
          }
        }
      }
    });

    res.json(updatedReview);
  } catch (error) {
    console.error('Erro ao atualizar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a review existe
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review não encontrada' });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar reviews populares
export const getPopularReviews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularReviews = await prisma.review.findMany({
      where: {
        rating: {
          gte: 4
        }
      },
      take: parseInt(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            coverUrl: true
          }
        }
      },
      orderBy: [
        {
          rating: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });

    res.json(popularReviews);
  } catch (error) {
    console.error('Erro ao buscar reviews populares:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar reviews recentes
export const getRecentReviews = async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const reviews = await prisma.review.findMany({
      where: {
        createdAt: {
          gte: daysAgo
        }
      },
      take: parseInt(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            coverUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      reviews,
      period: `Últimos ${days} dias`,
      total: reviews.length
    });
  } catch (error) {
    console.error('Erro ao buscar reviews recentes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};