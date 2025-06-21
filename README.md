# GameReviews - Sistema de Avaliação de Jogos

![GameReviews](https://img.shields.io/badge/GameReviews-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff)
![License](https://img.shields.io/badge/licença-MIT-orange)

Sistema completo de avaliação e recomendação de jogos desenvolvido como parte do Projeto Interdisciplinar do 3º semestre do curso de Desenvolvimento de Software Multiplataforma.

**Grupo 10 - 2025/1:**

- Otávio Borges Colimo
- Paulo Ricardo de Azevedo Alvino
- Thiago Cunha Archete Silva
- Vinicius de Araújo Silva

## 📋 Sobre o Projeto

O GameReviews é uma plataforma web que permite aos usuários:

- ✅ Avaliar jogos com notas de 1 a 5 estrelas
- ✅ Escrever reviews detalhadas
- ✅ Reagir às reviews de outros usuários (curtir/descurtir)
- ✅ Favoritar jogos
- ✅ Gerenciar perfil de usuário
- ✅ Visualizar estatísticas pessoais

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **React Router** - Navegação entre páginas
- **CSS Modules** - Estilização modular
- **Context API** - Gerenciamento de estado global

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação de usuários
- **bcrypt** - Hash de senhas

## 🚀 Executando o Projeto

### Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/DSM-P3-G10-2025-1.git
cd DSM-P3-G10-2025-1
```

### 2. Configure o Backend

```bash
# Entre na pasta do backend
cd back-end

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev
npx prisma generate

# Inicie o servidor backend
npm start
```

O backend estará rodando em `http://localhost:5000`

### 3. Configure o Frontend

```bash
# Volte para a pasta raiz
cd ..

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
DSM-P3-G10-2025-1/
├── src/                          # Código fonte do frontend
│   ├── Components/               # Componentes React
│   │   ├── Games/               # Componentes relacionados a jogos
│   │   ├── User/                # Componentes de usuário
│   │   ├── Header/              # Cabeçalho
│   │   ├── Footer/              # Rodapé
│   │   └── ...
│   ├── context/                 # Contextos React
│   ├── services/                # Serviços de API
│   ├── styles/                  # Estilos globais
│   └── ...
├── back-end/                    # Código fonte do backend
│   ├── src/                     # Código fonte
│   │   ├── controllers/         # Controladores
│   │   ├── routes/              # Rotas da API
│   │   ├── middleware/          # Middlewares
│   │   └── ...
│   ├── prisma/                  # Configuração do Prisma
│   └── ...
├── public/                      # Arquivos públicos
├── docs/                        # Documentação
└── ...
```

## 🎯 Funcionalidades Principais

### Autenticação

- Registro de novos usuários
- Login/logout
- Proteção de rotas
- Gerenciamento de sessão

### Jogos

- Listagem de jogos
- Visualização detalhada
- Sistema de busca
- Favoritação
- Avaliações e reviews

### Reviews

- Criação de reviews
- Edição/exclusão (próprias reviews)
- Sistema de reações (like/dislike)
- Visualização por jogo ou usuário

### Perfil do Usuário

- Edição de informações pessoais
- Estatísticas pessoais
- Histórico de reviews
- Lista de favoritos

## 🔧 Scripts Disponíveis

### Frontend

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executa linter
```

### Backend

```bash
npm start            # Inicia servidor de produção
npm run dev          # Inicia servidor de desenvolvimento
npm run db:migrate   # Executa migrações do banco
npm run db:generate  # Gera cliente Prisma
```

## 🌐 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário atual

### Usuários

- `GET /api/users/:id` - Dados do usuário
- `PUT /api/users/:id` - Atualizar usuário
- `GET /api/users/:id/stats` - Estatísticas do usuário

### Jogos

- `GET /api/games` - Listar jogos
- `GET /api/games/:id` - Detalhes do jogo
- `POST /api/games` - Criar jogo (admin)

### Reviews

- `GET /api/reviews` - Listar reviews
- `POST /api/reviews` - Criar review
- `PUT /api/reviews/:id` - Atualizar review
- `DELETE /api/reviews/:id` - Deletar review

### Reações

- `POST /api/review-reactions` - Reagir a review
- `GET /api/review-reactions/review/:id` - Reações de uma review

### Favoritos

- `POST /api/favorites` - Adicionar favorito
- `DELETE /api/favorites/:gameId` - Remover favorito
- `GET /api/favorites/user/:userId` - Favoritos do usuário

## 🎨 Design System

O projeto utiliza um design system consistente com:

- Paleta de cores definida
- Tipografia padronizada
- Componentes reutilizáveis
- Responsividade mobile-first
- Sistema de toast para feedbacks
- Modais para confirmações

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

**FATEC FRANCA**
- Curso: Desenvolvimento de Software Multiplataforma
- Semestre: 3º - 2025/1
- Disciplina: Projeto Interdisciplinar

---

⭐ Desenvolvido pelo Grupo 10
