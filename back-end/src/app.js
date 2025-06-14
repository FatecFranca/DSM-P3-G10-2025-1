import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rotas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import commentReactionRoutes from './routes/commentReactionRoutes.js';
import reviewReactionRoutes from './routes/reviewReactionRoutes.js';
import gameProgressRoutes from './routes/gameProgressRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'GameReviews API funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/comment-reactions', commentReactionRoutes);
app.use('/api/review-reactions', reviewReactionRoutes);
app.use('/api/game-progress', gameProgressRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  
  // Erro de validação do Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({ 
      error: 'Dados duplicados',
      details: err.meta?.target 
    });
  }
  
  // Erro de dados não encontrados do Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({ 
      error: 'Recurso não encontrado' 
    });
  }
  
  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Token inválido' 
    });
  }
  
  // Erro de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token expirado' 
    });
  }

  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado!'
  });
});

export default app;