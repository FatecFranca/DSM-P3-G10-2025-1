#!/usr/bin/env node

import app from '../app.js';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Teste a API: http://localhost:${PORT}/api/test`);
});