const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes funcionando!' });
});

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, username, avatarUrl } = req.body;
    
    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }
    
    // Verificar se email já está em uso
    const existingUserEmail = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUserEmail) {
      return res.status(409).json({ message: 'Este email já está em uso' });
    }
    
    // Verificar se username já está em uso (se fornecido)
    if (username) {
      const existingUserName = await prisma.user.findUnique({
        where: { username }
      });
      
      if (existingUserName) {
        return res.status(409).json({ message: 'Este nome de usuário já está em uso' });
      }
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
        avatarUrl
      }
    });
    
    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET || 'sua-chave-secreta',
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao processar o registro' });
  }
});

// Rota de login
router.post('/login', authController.login);

module.exports = router;