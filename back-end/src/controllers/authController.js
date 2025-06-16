const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-temporaria';

// Login de usuário
exports.login = async (req, res) => {
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

    // Comparar a senha fornecida com a hash armazenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Se a senha não for válida
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Excluir a senha dos dados retornados
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