import prisma from '../config/database.js';

export const createGenre = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    // Verificar se o slug já existe
    const existingGenre = await prisma.genre.findUnique({
      where: { slug }
    });

    if (existingGenre) {
      return res.status(400).json({ error: 'Slug já está em uso' });
    }

    const genre = await prisma.genre.create({
      data: {
        name,
        slug,
        description
      }
    });

    res.status(201).json(genre);
  } catch (error) {
    console.error('Erro ao criar gênero:', error);
    res.status(500).json({ error: 'Erro ao criar gênero' });
  }
};

export const getAllGenres = async (req, res) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: { games: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(genres);
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    res.status(500).json({ error: 'Erro ao buscar gêneros' });
  }
};

export const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;

    const genre = await prisma.genre.findUnique({
      where: { id },
      include: {
        games: {
          take: 10, // Limitar a 10 jogos por performance
          include: {
            reviews: {
              select: { rating: true }
            }
          }
        },
        _count: {
          select: { games: true }
        }
      }
    });

    if (!genre) {
      return res.status(404).json({ error: 'Gênero não encontrado' });
    }

    // Calcular média de avaliações para os jogos
    const gamesWithRating = genre.games.map(game => {
      const totalRatings = game.reviews.length;
      const averageRating = totalRatings > 0 
        ? game.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

      return {
        ...game,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: totalRatings,
        reviews: undefined
      };
    });

    res.json({
      ...genre,
      games: gamesWithRating
    });
  } catch (error) {
    console.error('Erro ao buscar gênero:', error);
    res.status(500).json({ error: 'Erro ao buscar gênero' });
  }
};

export const getGenreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const genre = await prisma.genre.findUnique({
      where: { slug },
      include: {
        games: {
          include: {
            reviews: {
              select: { rating: true }
            }
          }
        },
        _count: {
          select: { games: true }
        }
      }
    });

    if (!genre) {
      return res.status(404).json({ error: 'Gênero não encontrado' });
    }

    // Calcular média de avaliações para os jogos
    const gamesWithRating = genre.games.map(game => {
      const totalRatings = game.reviews.length;
      const averageRating = totalRatings > 0 
        ? game.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

      return {
        ...game,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: totalRatings,
        reviews: undefined
      };
    });

    res.json({
      ...genre,
      games: gamesWithRating
    });
  } catch (error) {
    console.error('Erro ao buscar gênero:', error);
    res.status(500).json({ error: 'Erro ao buscar gênero' });
  }
};

export const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    // Verificar se o slug já existe (exceto para o próprio gênero)
    if (slug) {
      const existingGenre = await prisma.genre.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      });

      if (existingGenre) {
        return res.status(400).json({ error: 'Slug já está em uso' });
      }
    }

    const genre = await prisma.genre.update({
      where: { id },
      data: { name, slug, description }
    });

    res.json(genre);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gênero não encontrado' });
    }
    console.error('Erro ao atualizar gênero:', error);
    res.status(500).json({ error: 'Erro ao atualizar gênero' });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se há jogos associados ao gênero
    const genreWithGames = await prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true }
        }
      }
    });

    if (!genreWithGames) {
      return res.status(404).json({ error: 'Gênero não encontrado' });
    }

    if (genreWithGames._count.games > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir gênero que possui jogos associados' 
      });
    }

    await prisma.genre.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gênero não encontrado' });
    }
    console.error('Erro ao deletar gênero:', error);
    res.status(500).json({ error: 'Erro ao deletar gênero' });
  }
};