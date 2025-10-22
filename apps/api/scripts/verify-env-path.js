#!/usr/bin/env node
/**
 * Script para verificar se o NestJS está carregando o .env.local correto
 * Run: node apps/api/scripts/verify-env-path.js
 */

const path = require('path');
const fs = require('fs');

console.log('🔍 Verificando caminhos de .env...\n');

// Simular __dirname como será em runtime (dist folder)
const runtimeDir = path.resolve(__dirname, '../dist');
console.log('📂 __dirname simulado (runtime):', runtimeDir);

// Caminhos que serão resolvidos
const paths = ['../../../.env.local', '../../../.env', '../../../.env.example'];

console.log('\n📍 Caminhos resolvidos:\n');

paths.forEach((relativePath) => {
  const resolved = path.resolve(runtimeDir, relativePath);
  const exists = fs.existsSync(resolved);
  const status = exists ? '✅' : '❌';

  console.log(`${status} ${relativePath}`);
  console.log(`   → ${resolved}`);
  console.log(`   → ${exists ? 'Arquivo encontrado' : 'Arquivo NÃO encontrado'}\n`);
});

// Verificar conteúdo do .env.local
const envLocalPath = path.resolve(runtimeDir, '../../../.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('📄 Conteúdo do .env.local (primeiras linhas):');
  console.log('─'.repeat(50));
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const lines = content.split('\n').slice(0, 5);
  lines.forEach((line) => {
    // Mascarar valores sensíveis
    if (line.includes('=') && !line.startsWith('#')) {
      const [key] = line.split('=');
      console.log(`${key}=***`);
    } else {
      console.log(line);
    }
  });
  console.log('─'.repeat(50));
} else {
  console.log('⚠️  .env.local não encontrado!');
}

console.log('\n✅ Verificação concluída!\n');
