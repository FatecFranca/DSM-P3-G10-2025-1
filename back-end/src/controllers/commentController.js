import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Criar comentário
export const createComment = async (req, res) => {
  const { userId, reviewId, content } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: { userId, reviewId, content },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true }
        }
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar comentários por review
export const getCommentsByReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { reviewId },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true }
        }
      }
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar todos os comentários
export const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true }
        }
      }
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover comentário
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

