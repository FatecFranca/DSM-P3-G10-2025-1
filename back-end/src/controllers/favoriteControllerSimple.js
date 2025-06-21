import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToFavorites = async (req, res) => {
  try {
    console.log("Adicionando aos favoritos...");
    const { gameId, userId } = req.body;

    console.log("userId:", userId, "gameId:", gameId);

    if (!gameId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Game ID e User ID são obrigatórios",
      });
    }

    // Verificar se o favorito já existe
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(200).json({
        success: true,
        data: existingFavorite,
        message: "Jogo já está nos favoritos",
      });
    }

    // Criar novo favorito
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        gameId,
      },
    });

    res.status(201).json({
      success: true,
      data: favorite,
      message: "Jogo adicionado aos favoritos",
    });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);

    // Tratar erro de constraint unique (caso escape da verificação anterior)
    if (error.code === "P2002") {
      return res.status(200).json({
        success: true,
        message: "Jogo já está nos favoritos",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID é obrigatório no body da requisição",
      });
    }

    // Verificar se o favorito existe antes de tentar deletar
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (!existingFavorite) {
      return res.status(200).json({
        success: true,
        message: "Jogo não estava nos favoritos",
      });
    }

    // Deletar o favorito
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

    // Tratar erro de registro não encontrado
    if (error.code === "P2025") {
      return res.status(200).json({
        success: true,
        message: "Jogo não estava nos favoritos",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const userId =
      req.query.userId || req.body.userId || "507f1f77bcf86cd799439012";

    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
    });

    res.json({
      success: true,
      data: favorites,
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
    const userId =
      req.query.userId || req.body.userId || "507f1f77bcf86cd799439012";

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
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};
