const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-temporaria';

exports.protect = async (req, res, next) => {
  try {
    // Verificar se o token está presente no header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Se não houver token, retornar erro
    if (!token) {
      return res.status(401).json({ 
        message: 'Acesso negado. Faça login para continuar.' 
      });
    }

    // Verificar se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar o usuário pelo ID no token
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    // Se o usuário não existir
    if (!user) {
      return res.status(401).json({ 
        message: 'Usuário não encontrado' 
      });
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = user;

    // Continuar para o próximo middleware
    next();

  } catch (error) {
    console.error('Erro de autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Sessão expirada. Faça login novamente.' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Erro interno de autenticação' 
    });
  }
};

// Use este middleware para proteger rotas:
// router.get('/rota-protegida', authMiddleware.protect, controller.metodo);