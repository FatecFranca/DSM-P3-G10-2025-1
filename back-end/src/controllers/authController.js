const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-temporaria';

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar entradas
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar se o usuário tem uma senha definida
    if (!user.password) {
      return res.status(401).json({ 
        message: 'Conta incompleta. Entre em contato com o suporte.' 
      });
    }

    // Comparar a senha fornecida com a hash armazenada
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error('Erro na verificação da senha:', bcryptError);
      
      // Se a senha não estiver no formato bcrypt, pode ser um texto simples para desenvolvimento
      isPasswordValid = password === user.password;
    }

    // Se a senha não for válida
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Remover campos sensíveis
    const { password: _, ...userWithoutPassword } = user;

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retornar dados do usuário e token
    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Erro durante o login:', error);
    return res.status(500).json({ 
      message: 'Erro interno do servidor' 
    });
  }
};

// Validação de token
const validateToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json({
      valid: true,
      user
    });
  } catch (error) {
    console.error('Erro na validação do token:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  login,
  validateToken
};