# GameReviews API - Backend

![GameReviews Logo](https://img.shields.io/badge/GameReviews-API-ff0f35)
![Version](https://img.shields.io/badge/versão-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2d3748)
![SQLite](https://img.shields.io/badge/SQLite-3.x-003b57)
![License](https://img.shields.io/badge/licença-MIT-orange)

API backend da plataforma GameReviews - Um sistema de avaliação e recomendação de jogos desenvolvido como parte do Projeto Integrador do curso de Desenvolvimento de Software Multiplataforma.

**Grupo 10 - 2025/1:**

- Otávio Borges Colimo
- Paulo Ricardo de Azevedo Alvino
- Thiago Cunha Archete Silva
- Vinicius de Araújo Silva

## 📋 Índice

- [Configuração Inicial](#-configuração-inicial)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#-banco-de-dados)
- [Endpoints da API](#-endpoints-da-api)
- [Modelos de Dados](#-modelos-de-dados)
- [Executando o Projeto](#-executando-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Scripts Disponíveis](#-scripts-disponíveis)

## 🚀 Configuração Inicial

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18.x ou superior)
- [Git](https://git-scm.com/)

### Instalação

```bash
# Entre na pasta do backend
cd back-end

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev
npx prisma generate

# Inicie o servidor
npm start
```

### Configuração do Ambiente

Crie um arquivo `.env` na pasta `back-end`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_jwt_aqui"
PORT=5000
NODE_ENV=development
```

## 📁 Estrutura do Projeto

```
back-end/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do banco
├── src/
│   ├── controllers/           # Controladores da API
│   │   ├── authController.js
│   │   ├── gameController.js
│   │   ├── reviewController.js
│   │   ├── reviewReactionController.js
│   │   ├── favoriteController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # Middleware de autenticação
│   ├── routes/                # Rotas da API
│   │   ├── authRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── reviewReactionRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── userRoutes.js
│   ├── database/
│   │   └── client.js          # Cliente Prisma
│   ├── lib/
│   │   └── utils.js           # Funções utilitárias
│   ├── bin/
│   │   └── server.js          # Servidor HTTP
│   └── app.js                 # Configuração do Express
├── .env                       # Variáveis de ambiente
├── package.json               # Dependências e scripts
└── README.md                  # Esta documentação
```

## �️ Banco de Dados

O projeto utiliza SQLite como banco de dados com Prisma como ORM.

### Modelos Principais

- **User** - Usuários do sistema
- **Game** - Jogos disponíveis
- **Review** - Avaliações dos jogos
- **ReviewReaction** - Curtidas/descurtidas em reviews
- **Favorite** - Jogos favoritos dos usuários

### Schema do Banco

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  bio       String?
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reviews         Review[]
  reviewReactions ReviewReaction[]
  favorites       Favorite[]
  createdGames    Game[]
}

model Game {
  id          String   @id @default(cuid())
  title       String
  description String
  coverUrl    String?
  genre       String
  releaseDate String
  platform    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?

  creator   User?      @relation(fields: [createdBy], references: [id])
  reviews   Review[]
  favorites Favorite[]
}

model Review {
  id        String   @id @default(cuid())
  rating    Int
  comment   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  gameId    String

  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  game      Game             @relation(fields: [gameId], references: [id], onDelete: Cascade)
  reactions ReviewReaction[]

  @@unique([userId, gameId])
}

model ReviewReaction {
  id       String      @id @default(cuid())
  type     ReactionType
  userId   String
  reviewId String

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@unique([userId, reviewId])
}

model Favorite {
  id     String @id @default(cuid())
  userId String
  gameId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  game Game @relation(fields: [gameId], references: [id], onDelete: Cascade)

  @@unique([userId, gameId])
}

enum ReactionType {
  LIKE
  DISLIKE
}
```

## 🛣️ Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário logado

### Usuários

- `GET /api/users/:id` - Obter dados de um usuário
- `PUT /api/users/:id` - Atualizar dados do usuário
- `GET /api/users/:id/stats` - Obter estatísticas do usuário

### Jogos

- `GET /api/games` - Listar todos os jogos
- `GET /api/games/:id` - Obter detalhes de um jogo
- `POST /api/games` - Criar um novo jogo (requer autenticação)
- `PUT /api/games/:id` - Atualizar um jogo (requer autenticação)
- `DELETE /api/games/:id` - Excluir um jogo (requer autenticação)

### Reviews

- `GET /api/reviews` - Listar reviews (com filtros por gameId ou userId)
- `GET /api/reviews/:id` - Obter uma review específica
- `POST /api/reviews` - Criar/atualizar uma review (requer autenticação)
- `PUT /api/reviews/:id` - Atualizar uma review (requer autenticação)
- `DELETE /api/reviews/:id` - Excluir uma review (requer autenticação)

### Reações de Review

- `GET /api/review-reactions/review/:reviewId` - Listar reações de uma review
- `POST /api/review-reactions` - Criar ou atualizar reação em review (requer autenticação)
- `DELETE /api/review-reactions/:id` - Excluir reação de review (requer autenticação)

### Favoritos

- `GET /api/favorites/user/:userId` - Listar jogos favoritos de um usuário
- `POST /api/favorites` - Adicionar jogo aos favoritos (requer autenticação)
- `DELETE /api/favorites/:gameId` - Remover jogo dos favoritos (requer autenticação)

## 🔧 Scripts Disponíveis

```bash
# Iniciar servidor de produção
npm start

# Iniciar servidor de desenvolvimento (com hot reload)
npm run dev

# Executar migrações do banco de dados
npm run db:migrate

# Gerar cliente Prisma
npm run db:generate

# Reset do banco de dados
npm run db:reset

# Visualizar banco de dados (Prisma Studio)
npm run db:studio
```

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM moderno para Node.js
- **SQLite** - Banco de dados SQL leve
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **cors** - Middleware para CORS
- **dotenv** - Carregamento de variáveis de ambiente

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Como usar:

1. Registre-se ou faça login para obter um token
2. Inclua o token no header Authorization das requisições protegidas:
   ```
   Authorization: Bearer seu_token_jwt_aqui
   ```

### Rotas Protegidas:

- Todas as rotas POST, PUT, DELETE (exceto register/login)
- Rotas que acessam dados sensíveis do usuário

## 📊 Respostas da API

### Formato de Sucesso

```json
{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso"
}
```

### Formato de Erro

```json
{
  "success": false,
  "error": "Descrição do erro",
  "message": "Mensagem de erro amigável"
}
```

## � Executando o Projeto

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma migrate dev
npx prisma generate

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:5000`

### Produção

```bash
# Instalar dependências
npm install --production

# Configurar banco de dados
npx prisma migrate deploy
npx prisma generate

# Iniciar servidor
npm start
```

## 📈 Monitoramento

O servidor inclui logs detalhados para monitoramento:

- Requisições HTTP
- Operações de banco de dados
- Erros e exceções
- Autenticação e autorização

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

---

**FATEC FRANCA**
- Curso: Desenvolvimento de Software Multiplataforma
- Semestre: 3º - 2025/1
- Disciplina: Projeto Interdisciplinar

⭐ Desenvolvido com ❤️ pelo Grupo 10

### Conexão com MongoDB Local

Para configurar o MongoDB local com replica set:

1. Inicialize o MongoDB com replica set:

```bash
mongod --replSet rs0 --dbpath /caminho/para/data/db
```

2. Configure o replica set (apenas na primeira vez):

```bash
# No cliente mongo
mongo
> rs.initiate()
```

### Modelos de Dados

O sistema possui os seguintes modelos principais:

- Usuários
- Jogos
- Reviews
- Gêneros/Categorias
- Comentários
- Favoritos

## 🌐 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh-token` - Renovação de token

### Usuários

- `GET /api/users/me` - Obter perfil do usuário autenticado
- `PUT /api/users/me` - Atualizar perfil do usuário
- `PUT /api/users/me/password` - Alterar senha
- `DELETE /api/users/me` - Excluir conta

### Jogos

- `GET /api/games` - Listar jogos
- `GET /api/games/:id` - Obter detalhes de um jogo
- `GET /api/games/featured` - Obter jogos em destaque
- `POST /api/games` - Criar um novo jogo
- `PUT /api/games/:id` - Atualizar um jogo
- `DELETE /api/games/:id` - Excluir um jogo

### Reviews

- `GET /api/reviews` - Listar reviews
- `GET /api/reviews/:id` - Obter uma review específica
- `POST /api/reviews` - Criar uma nova review
- `PUT /api/reviews/:id` - Atualizar uma review
- `DELETE /api/reviews/:id` - Excluir uma review
- `GET /api/reviews/popular` - Listar reviews populares
- `GET /api/reviews/recent` - Listar reviews recentes

### Comentários

- `GET /api/comments/review/:reviewId` - Listar comentários de uma review
- `POST /api/comments` - Criar um novo comentário
- `DELETE /api/comments/:id` - Excluir um comentário

### Reações de Comentário

- `GET /api/comment-reactions/comment/:commentId` - Listar reações de um comentário
- `POST /api/comment-reactions` - Criar ou atualizar reação em comentário
- `DELETE /api/comment-reactions/:id` - Excluir reação de comentário

### Reações de Review

- `GET /api/review-reactions/review/:reviewId` - Listar reações de uma review
- `POST /api/review-reactions` - Criar ou atualizar reação em review
- `DELETE /api/review-reactions/:id` - Excluir reação de review

### Progresso de Jogo

- `GET /api/game-progress/user/:userId` - Listar progresso de jogos de um usuário
- `GET /api/game-progress/game/:gameId` - Listar usuários por progresso de um jogo
- `GET /api/game-progress/status/:status` - Listar jogos por status de progresso
- `POST /api/game-progress` - Atualizar ou criar progresso de jogo
- `DELETE /api/game-progress/:id` - Excluir progresso de jogo

### Gêneros/Categorias

- `GET /api/genres` - Listar todos os gêneros
- `GET /api/genres/:id` - Obter detalhes de um gênero
- `GET /api/genres/slug/:slug` - Obter gênero pelo slug

### Favoritos

- `GET /api/users/me/favorites` - Listar jogos favoritos
- `POST /api/users/me/favorites/:gameId` - Adicionar jogo aos favoritos
- `DELETE /api/users/me/favorites/:gameId` - Remover jogo dos favoritos

## 📊 Modelos de Dados

### Usuário

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  nome      String
  email     String   @unique
  senha     String
  avatar    String?
  role      String   @default("user")
  criadoEm  DateTime @default(now())
  reviews   Review[]
  favoritos Game[]   @relation(fields: [gameIds], references: [id])
  gameIds   String[] @db.ObjectId
}
```

### Jogo

```prisma
model Game {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  nome           String
  descricao      String
  capa           String
  dataLancamento DateTime?
  desenvolvedor  String?
  genreIds       String[]  @db.ObjectId
  generos        Genre[]   @relation(fields: [genreIds], references: [id])
  plataformas    String[]
  reviews        Review[]
  criadoEm       DateTime  @default(now())
  atualizadoEm   DateTime  @updatedAt
  favoritos      User[]    @relation(fields: [userIds], references: [id])
  userIds        String[]  @db.ObjectId
}
```

### Review

```prisma
model Review {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  nota      Float
  titulo    String
  texto     String
  resumo    String
  userId    String   @db.ObjectId
  usuario   User     @relation(fields: [userId], references: [id])
  gameId    String   @db.ObjectId
  game      Game     @relation(fields: [gameId], references: [id])
  likes     Int      @default(0)
  views     Int      @default(0)
  criadoEm  DateTime @default(now())
  atualizadoEm DateTime @updatedAt
}
```

### Gênero

```prisma
model Genre {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  nome      String
  slug      String   @unique
  descricao String?
  games     Game[]   @relation(fields: [gameIds], references: [id])
  gameIds   String[] @db.ObjectId
}
```

## ▶️ Executando o Projeto

```bash
# Modo de desenvolvimento com hot-reload
npm run dev

# Compilar para produção
npm run build

# Executar em produção
npm start
```

## 🧩 Ambiente de Desenvolvimento

### Scripts disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build`: Compila o projeto para produção
- `npm start`: Inicia o servidor em modo de produção
- `npm run lint`: Executa verificação de código com ESLint
- `npm run seed`: Popula o banco de dados com dados iniciais

### Variáveis de Ambiente

- `PORT`: Porta onde o servidor será executado (padrão: 5000)
- `DATABASE_URL`: URI de conexão com o banco MongoDB
- `JWT_SECRET`: Chave secreta para geração de tokens JWT
- `JWT_EXPIRY`: Tempo de expiração do token (padrão: '1d')
- `NODE_ENV`: Ambiente de execução (development, production, test)

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/) - Ambiente de execução JavaScript server-side
- [Express](https://expressjs.com/) - Framework web para Node.js
- [MongoDB](https://www.mongodb.com/) - Banco de dados NoSQL
- [Prisma](https://www.prisma.io/) - ORM para Node.js e TypeScript
- [JWT](https://jwt.io/) - Autenticação baseada em tokens
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Criptografia de senhas
- [cors](https://www.npmjs.com/package/cors) - Middleware para habilitar CORS
- [dotenv](https://www.npmjs.com/package/dotenv) - Carregamento de variáveis de ambiente
- [multer](https://www.npmjs.com/package/multer) - Middleware para upload de arquivos

## 👥 Contribuição

Para contribuir com este projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

Desenvolvido pelo Grupo 10 - DSM 2025/1 - Faculdade de Tecnologia de Franca
