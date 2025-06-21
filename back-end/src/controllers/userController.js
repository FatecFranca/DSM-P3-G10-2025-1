import prisma from "../database/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email já está em uso" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatarUrl,
      },
    });

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { reviews: true },
        },
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        reviews: {
          include: {
            game: {
              select: {
                id: true,
                title: true,
                coverUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, bio },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Excluir as dependências do usuário em ordem
    await prisma.$transaction(async (tx) => {
      // 1. Excluir reações de reviews do usuário
      await tx.reviewReaction.deleteMany({
        where: { userId: id },
      });

      // 2. Excluir reviews do usuário
      await tx.review.deleteMany({
        where: { userId: id },
      });

      // 3. Excluir favoritos do usuário
      await tx.favorite.deleteMany({
        where: { userId: id },
      });

      // 4. Por último, excluir o usuário
      await tx.user.delete({
        where: { id },
      });
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};

// Buscar estatísticas do usuário
export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = id; // Manter como string para MongoDB ObjectId

    // Buscar count de reviews do usuário
    const reviewsCount = await prisma.review.count({
      where: { userId },
    }); // Buscar count de jogos criados pelo usuário
    const gamesCreated = await prisma.game.count({
      where: { createdBy: userId },
    }); // Buscar likes recebidos (reações positivas nas reviews do usuário)
    const likesReceived = await prisma.reviewReaction.count({
      where: {
        type: "LIKE",
        review: {
          userId: userId,
        },
      },
    });

    // Buscar dislikes recebidos (reações negativas nas reviews do usuário)
    const dislikesReceived = await prisma.reviewReaction.count({
      where: {
        type: "DISLIKE",
        review: {
          userId: userId,
        },
      },
    });
    const stats = {
      likesReceived,
      dislikesReceived,
      reviewsCount,
      gamesCreated,
    };

    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas do usuário" });
  }
};
