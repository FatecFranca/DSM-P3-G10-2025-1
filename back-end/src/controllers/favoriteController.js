import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToFavorites = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId || !gameId) {
      return res.status(400).json({
        success: false,
        message: "User ID e Game ID são obrigatórios",
      });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Jogo já está nos favoritos",
      });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        gameId,
      },
      include: {
        game: true,
      },
    });

    res.status(201).json({
      success: true,
      data: favorite,
      message: "Jogo adicionado aos favoritos",
    });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (!userId || !gameId) {
      return res.status(400).json({
        success: false,
        message: "User ID e Game ID são obrigatórios",
      });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorito não encontrado",
      });
    }

    await prisma.favorite.delete({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    res.json({
      success: true,
      message: "Jogo removido dos favoritos",
    });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID é obrigatório",
      });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        game: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const games = favorites.map((favorite) => favorite.game);

    res.json({
      success: true,
      data: games,
    });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const checkIsFavorite = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user?.id || req.query.userId;

    if (!userId || !gameId) {
      return res.json({
        success: true,
        isFavorite: false,
      });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    res.json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    res.json({
      success: true,
      isFavorite: false,
    });
  }
};
