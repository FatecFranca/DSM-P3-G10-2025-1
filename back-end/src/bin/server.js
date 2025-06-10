import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rotas
import reviewRoutes from '../routes/reviewRoutes.js';
import gameRoutes from '../routes/gameRoutes.js';
import genreRoutes from '../routes/genreRoutes.js';
import userRoutes from '../routes/userRoutes.js';

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Game Reviews API',
    version: '1.0.0',
    status: 'Online',
    endpoints: {
      reviews: '/api/reviews',
      games: '/api/games',
      genres: '/api/genres',
      users: '/api/users'
    },
    documentation: {
      reviews: {
        'GET /api/reviews': 'Listar todas as reviews',
        'POST /api/reviews': 'Criar nova review',
        'GET /api/reviews/:id': 'Buscar review por ID',
        'PUT /api/reviews/:id': 'Atualizar review',
        'DELETE /api/reviews/:id': 'Deletar review',
        'GET /api/reviews/popular': 'Reviews populares',
        'GET /api/reviews/recent': 'Reviews recentes'
      },
      games: {
        'GET /api/games': 'Listar todos os jogos',
        'POST /api/games': 'Criar novo jogo',
        'GET /api/games/:id': 'Buscar jogo por ID',
        'PUT /api/games/:id': 'Atualizar jogo',
        'DELETE /api/games/:id': 'Deletar jogo',
        'GET /api/games/featured': 'Jogos em destaque'
      },
      genres: {
        'GET /api/genres': 'Listar todos os gêneros',
        'POST /api/genres': 'Criar novo gênero',
        'GET /api/genres/:id': 'Buscar gênero por ID',
        'PUT /api/genres/:id': 'Atualizar gênero',
        'DELETE /api/genres/:id': 'Deletar gênero',
        'GET /api/genres/popular': 'Gêneros populares'
      },
      users: {
        'GET /api/users': 'Listar todos os usuários',
        'POST /api/users': 'Criar novo usuário',
        'GET /api/users/:id': 'Buscar usuário por ID',
        'PUT /api/users/:id': 'Atualizar usuário',
        'DELETE /api/users/:id': 'Deletar usuário'
      }
    }
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Configurar rotas da API
app.use('/api/reviews', reviewRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/users', userRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method,
    message: 'Verifique a documentação em GET / para endpoints disponíveis'
  });
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro no servidor:', error);
  
  res.status(error.status || 500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor rodando na porta ${PORT}
🌍 URL: http://localhost:${PORT}
📚 Documentação: http://localhost:${PORT}/
🏥 Health Check: http://localhost:${PORT}/health

📋 Endpoints disponíveis:
   • Reviews: http://localhost:${PORT}/api/reviews
   • Games: http://localhost:${PORT}/api/games
   • Genres: http://localhost:${PORT}/api/genres
   • Users: http://localhost:${PORT}/api/users
  `);
});

export default app;