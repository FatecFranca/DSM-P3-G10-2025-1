# Como popular os gêneros

Para adicionar gêneros padrão ao banco de dados, execute:

```bash
cd back-end
npm run seed:genres
```

Isso criará os seguintes gêneros:

- Ação
- Aventura
- RPG
- Estratégia
- Simulação
- Esportes
- Corrida
- Puzzle
- Plataforma
- Luta
- Tiro
- Horror
- Indie
- Casual
- MMORPG

## Novas funcionalidades implementadas:

### 1. Upload de Imagem

- Substituído campo "URL da Capa" por upload de arquivo
- Suporte para PNG, JPG, GIF (máximo 5MB)
- Preview da imagem selecionada
- Por enquanto usa Data URL (base64), mas pode ser facilmente integrado com serviços como Cloudinary/AWS S3

### 2. Gêneros Reais

- Carrega gêneros do banco de dados
- Interface com checkboxes para seleção múltipla
- Script para popular gêneros padrão

## Como usar:

1. Execute o script de gêneros (comando acima)
2. Acesse `/admin/jogos` no site
3. Use o novo formulário com upload de imagem
4. Selecione gêneros da lista real do banco
