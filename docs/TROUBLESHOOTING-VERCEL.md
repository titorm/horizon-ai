# 🔧 Troubleshooting - Vercel Serverless

## Problemas Comuns e Soluções

### 1. ❌ Erro: "Cannot find module 'express'"

**Causa**: `express` está em `devDependencies` em vez de `dependencies`

**Solução**:
```bash
cd apps/api
pnpm add express
pnpm remove -D express
git commit -am "fix: move express to dependencies"
vercel --prod
```

---

### 2. ❌ Erro: "Function execution timed out"

**Causa**: A função está demorando mais que o limite (10s no Hobby)

**Soluções**:
1. Otimize queries do banco de dados
2. Use cache mais agressivo
3. Upgrade para plano Pro (60s) ou Enterprise (900s)
4. Mova operações longas para background jobs

**Debug**:
```bash
# Ver logs em tempo real
vercel logs --follow
```

---

### 3. ❌ Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa**: CORS não configurado corretamente ou domínio não permitido

**Solução**:
```bash
# Adicionar domínio ao CORS_ORIGIN
vercel env add CORS_ORIGIN
# Valor: https://seu-dominio.vercel.app,https://*.vercel.app

# Redeploy
vercel --prod
```

---

### 4. ❌ Erro: "ECONNREFUSED" ou "Appwrite connection failed"

**Causa**: Variáveis de ambiente do Appwrite não configuradas

**Solução**:
```bash
# Verificar variáveis
vercel env ls

# Adicionar se faltando
vercel env add APPWRITE_ENDPOINT
vercel env add APPWRITE_PROJECT_ID
vercel env add APPWRITE_API_KEY
vercel env add APPWRITE_DATABASE_ID

# Redeploy
vercel --prod
```

---

### 5. ❌ Erro: "Module not found: Can't resolve './env-loader'"

**Causa**: Build está faltando arquivos necessários

**Solução**:
```bash
# Verificar se env-loader existe
ls apps/api/src/env-loader.ts

# Rebuild
cd apps/api
pnpm build

# Verificar dist
ls dist/env-loader.js

# Se ok, redeploy
vercel --prod
```

---

### 6. ❌ Site carrega mas API retorna 500

**Causa**: Erro interno na API, provavelmente variável de ambiente faltando

**Debug**:
```bash
# Ver logs da função
vercel logs [deployment-url] --follow

# Ver últimos erros
vercel logs [deployment-url] | grep ERROR
```

**Solução comum**:
- Verificar se todas as env vars estão definidas
- Verificar logs para mensagem específica
- Testar localmente com `vercel dev`

---

### 7. ❌ Cold starts muito lentos (>5s)

**Causa**: Primeira invocação da função após inatividade

**Soluções**:
1. **Warm-up ping** (gratuito):
   - Usar serviço como UptimeRobot para fazer ping a cada 5 min
   - Endpoint: `https://seu-dominio.vercel.app/api/health`

2. **Otimizar bundle**:
   ```bash
   # Remover dependências não usadas
   cd apps/api
   pnpm remove [pacote-não-usado]
   ```

3. **Pre-warming** (pago):
   - Upgrade para plano Pro
   - Habilitar "Prerender Functions"

---

### 8. ❌ Build falha com "Out of memory"

**Causa**: Build precisa de mais memória

**Soluções**:
1. **Simplificar build**:
   ```json
   // apps/api/tsconfig.json
   {
     "compilerOptions": {
       "sourceMap": false,  // Desabilitar sourcemaps
       "declarationMap": false
     }
   }
   ```

2. **Upgrade plano**: Pro tem mais memória para builds

---

### 9. ❌ Rotas da API retornam 404

**Causa**: Configuração de rotas no `vercel.json` incorreta

**Verificar**:
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/api/:path*",  // Deve capturar todas as rotas /api/*
      "destination": "/api"      // Deve apontar para /api/index.js
    }
  ]
}
```

**Testar**:
```bash
# Ver estrutura de rotas
vercel inspect [deployment-url]
```

---

### 10. ❌ JWT tokens não funcionam

**Causa**: `JWT_SECRET` diferente entre builds ou não definido

**Solução**:
```bash
# Definir JWT_SECRET consistente
vercel env add JWT_SECRET production
# Valor: usar um segredo forte e NUNCA mudá-lo

# Verificar se está definido
vercel env ls

# Redeploy
vercel --prod
```

---

## 🔍 Comandos de Debug

### Ver logs em tempo real
```bash
vercel logs --follow
```

### Ver logs de um deployment específico
```bash
vercel logs [deployment-url]
```

### Filtrar logs por erro
```bash
vercel logs [deployment-url] | grep -i error
```

### Ver detalhes do deployment
```bash
vercel inspect [deployment-url]
```

### Listar todos os deployments
```bash
vercel list
```

### Ver variáveis de ambiente
```bash
vercel env ls
```

### Testar localmente (modo serverless)
```bash
vercel dev
```

---

## 🧪 Como Testar

### 1. Health Check
```bash
curl https://seu-dominio.vercel.app/api/health
```

**Resposta esperada**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T..."
}
```

### 2. Login
```bash
curl -X POST https://seu-dominio.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Verificar CORS
```bash
curl -H "Origin: https://seu-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://seu-dominio.vercel.app/api/auth/login
```

**Deve retornar**:
```
Access-Control-Allow-Origin: https://seu-frontend.vercel.app
Access-Control-Allow-Credentials: true
```

---

## 📞 Suporte

Se nenhuma solução acima resolver:

1. **Logs detalhados**: `vercel logs [url] --follow`
2. **Teste local**: `vercel dev` (simula exatamente o ambiente de prod)
3. **Documentação Vercel**: https://vercel.com/docs/functions
4. **Suporte Vercel**: https://vercel.com/support

## 📚 Documentos Relacionados

- [VERCEL-SERVERLESS-GUIDE.md](./VERCEL-SERVERLESS-GUIDE.md)
- [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md)
- [SERVERLESS-SUMMARY.md](./SERVERLESS-SUMMARY.md)
