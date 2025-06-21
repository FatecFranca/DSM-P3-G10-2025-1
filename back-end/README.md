# GameReviews API - Backend

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

### Gêneros/Categorias

- `GET /api/genres` - Listar todos os gêneros
- `GET /api/genres/:id` - Obter detalhes de um gênero
- `GET /api/genres/slug/:slug` - Obter gênero pelo slug

### Favoritos

- `GET /api/users/me/favorites` - Listar jogos favoritos
- `POST /api/users/me/favorites/:gameId` - Adicionar jogo aos favoritos
- `DELETE /api/users/me/favorites/:gameId` - Remover jogo dos favoritos