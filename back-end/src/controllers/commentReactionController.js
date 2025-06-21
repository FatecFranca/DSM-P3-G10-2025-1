import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Criar ou atualizar reação em comentário
export const upsertCommentReaction = async (req, res) => {
  const { userId, commentId, type } = req.body;
  try {
    const existing = await prisma.commentReaction.findUnique({
      where: {
        userId_commentId: { userId, commentId }
      }
    });
    let reaction;
    if (existing) {
      reaction = await prisma.commentReaction.update({
        where: { id: existing.id },
        data: { type }
      });
    } else {
      reaction = await prisma.commentReaction.create({
        data: { userId, commentId, type }
      });
    }
    res.status(201).json(reaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar reações por comentário
export const getReactionsByComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const reactions = await prisma.commentReaction.findMany({
      where: { commentId },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true }
        }
      }
    });
    // Agrupar por tipo
    const grouped = {
      LIKE: reactions.filter(r => r.type === 'LIKE'),
      DISLIKE: reactions.filter(r => r.type === 'DISLIKE')
    };
    res.status(200).json({
      reactions,
      grouped,
      summary: {
        likes: grouped.LIKE.length,
        dislikes: grouped.DISLIKE.length,
        total: reactions.length
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover reação
export const removeCommentReaction = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.commentReaction.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

