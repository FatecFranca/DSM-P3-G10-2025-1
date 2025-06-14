# GameReviews API - Backend

![GameReviews Logo](https://img.shields.io/badge/GameReviews-API-ff0f35)
![Version](https://img.shields.io/badge/versão-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)
![License](https://img.shields.io/badge/licença-MIT-orange)

API backend da plataforma GameReviews - Um sistema de avaliação e recomendação de jogos desenvolvido como parte do Projeto Integrador do curso de Desenvolvimento de Software Multiplataforma.

## 📋 Índice

- [Configuração Inicial](#-configuração-inicial)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#-banco-de-dados)
- [Endpoints da API](#-endpoints-da-api)
- [Modelos de Dados](#-modelos-de-dados)
- [Executando o Projeto](#-executando-o-projeto)
- [Ambiente de Desenvolvimento](#-ambiente-de-desenvolvimento)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Contribuição](#-contribuição)

## 🚀 Configuração Inicial

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18.x ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6.0 ou superior)
- [Git](https://git-scm.com/)

### Clonando o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/DSM-P3-G10-2025-1.git

# Entre na pasta do projeto
cd DSM-P3-G10-2025-1

# Acesse a pasta do backend
cd back-end
```

### Instalação de Dependências

```bash
# Instale as dependências
npm install

# Instale o Prisma como dependência de desenvolvimento
npm install prisma --save-dev
```

### Configuração do Ambiente

1. Crie um arquivo `.env` na pasta `back-end` com base no arquivo `.env.example`:

```env
DATABASE_URL="mongodb://127.0.0.1:27017/gamereview?directConnection=true"
JWT_SECRET="sua_chave_secreta_jwt"
PORT=5000
NODE_ENV=development
```

2. Inicialize o Prisma:

```bash
npx prisma init --datasource-provider mongodb
```

3. Gere o cliente Prisma após qualquer modificação no schema:

```bash
npx prisma generate
```

## 📁 Estrutura do Projeto

```
back-end/
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   └── seed.js          # Script para popular o banco com dados iniciais
├── src/
│   ├── config/          # Configurações da aplicação
│   ├── controllers/     # Controladores de cada recurso
│   ├── middlewares/     # Middlewares da aplicação
│   ├── routes/          # Definição das rotas da API
│   ├── services/        # Lógica de negócio
│   ├── utils/           # Funções utilitárias
│   └── app.js           # Configuração do Express
├── .env                 # Variáveis de ambiente
├── package.json         # Dependências e scripts
└── README.md            # Documentação
```

## 🗄️ Banco de Dados

O projeto utiliza MongoDB como banco de dados NoSQL, com Prisma como ORM para facilitar as operações no banco.

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