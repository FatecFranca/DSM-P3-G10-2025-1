import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Atualizar progresso de um jogo
export const updateGameProgress = async (req, res) => {
  const { userId, gameId, status } = req.body;
  
  try {
    // Verificar se já existe um progresso para este usuário e jogo
    const existingProgress = await prisma.gameProgress.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    });
    
    let progress;
    
    if (existingProgress) {
      // Atualizar progresso existente
      progress = await prisma.gameProgress.update({
        where: { id: existingProgress.id },
        data: { status },
        include: {
          game: true
        }
      });
    } else {
      // Criar novo progresso
      progress = await prisma.gameProgress.create({
        data: {
          status,
          userId,
          gameId
        },
        include: {
          game: true
        }
      });
    }
    
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar progresso de jogos por usuário
export const getProgressByUser = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const progress = await prisma.gameProgress.findMany({
      where: { userId },
      include: {
        game: true
      }
    });
    
    // Agrupar por status
    const grouped = {
      WANT_TO_PLAY: progress.filter(p => p.status === 'WANT_TO_PLAY'),
      CURRENTLY_PLAYING: progress.filter(p => p.status === 'CURRENTLY_PLAYING'),
      COMPLETED: progress.filter(p => p.status === 'COMPLETED')
    };
    
    res.status(200).json({
      progress,
      grouped,
      summary: {
        wantToPlay: grouped.WANT_TO_PLAY.length,
        currentlyPlaying: grouped.CURRENTLY_PLAYING.length,
        completed: grouped.COMPLETED.length,
        total: progress.length
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar usuários por progresso de jogo
export const getUsersByGameProgress = async (req, res) => {
  const { gameId } = req.params;
  
  try {
    const progress = await prisma.gameProgress.findMany({
      where: { gameId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });
    
    // Agrupar por status
    const grouped = {
      WANT_TO_PLAY: progress.filter(p => p.status === 'WANT_TO_PLAY'),
      CURRENTLY_PLAYING: progress.filter(p => p.status === 'CURRENTLY_PLAYING'),
      COMPLETED: progress.filter(p => p.status === 'COMPLETED')
    };
    
    res.status(200).json({
      progress,
      grouped,
      summary: {
        wantToPlay: grouped.WANT_TO_PLAY.length,
        currentlyPlaying: grouped.CURRENTLY_PLAYING.length,
        completed: grouped.COMPLETED.length,
        total: progress.length
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar jogos por status
export const getGamesByStatus = async (req, res) => {
  const { status } = req.params;
  
  try {
    const progress = await prisma.gameProgress.findMany({
      where: { status },
      include: {
        game: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      }
    });
    
    res.status(200).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover progresso
export const removeProgress = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.gameProgress.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

