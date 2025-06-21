
function includeRelations(query) {

  // Por padrão, não inclui nenhum relacionamento
  const include = {}

  // Se o parâmetro "include" estiver na query string
  if(query.include) {
    // Recorta o valor do parâmetro, separando os
    // relacionamentos informados onde há vírgula
    const relations = query.include.split(',')

    // Preenche a const "include" com as relações informadas
    for(let rel of relations) {
      // Include de 2º nível (único caso nesta aplicação)
      if(rel === 'itens.produto') {
        include.itens = {
          include: { produto: true }
        }
      }
      else include[rel] = true
    }
  }

  return include
}

export { includeRelations }
