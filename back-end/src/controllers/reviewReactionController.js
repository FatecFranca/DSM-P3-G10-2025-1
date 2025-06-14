import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Criar ou atualizar reação em review
export const upsertReviewReaction = async (req, res) => {
  const { userId, reviewId, type } = req.body;
  try {
    const existing = await prisma.reviewReaction.findUnique({
      where: {
        userId_reviewId: { userId, reviewId }
      }
    });
    let reaction;
    if (existing) {
      reaction = await prisma.reviewReaction.update({
        where: { id: existing.id },
        data: { type }
      });
    } else {
      reaction = await prisma.reviewReaction.create({
        data: { userId, reviewId, type }
      });
    }
    res.status(201).json(reaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar reações por review
export const getReactionsByReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const reactions = await prisma.reviewReaction.findMany({
      where: { reviewId },
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
export const removeReviewReaction = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reviewReaction.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
