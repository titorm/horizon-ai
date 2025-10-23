# ✅ Checklist de Deploy Serverless no Vercel

Use este checklist antes de fazer o deploy para produção.

## 📋 Pré-Deploy

### 1. Código e Build
- [ ] Código está na branch correta (`feat/vercel` ou `main`)
- [ ] Todos os testes estão passando (`pnpm test`)
- [ ] Build local funciona sem erros (`./test-serverless-build.sh`)
- [ ] Não há erros de TypeScript (`pnpm typecheck`)
- [ ] Código está formatado (`pnpm format`)

### 2. Variáveis de Ambiente
- [ ] `APPWRITE_ENDPOINT` configurado no Vercel
- [ ] `APPWRITE_PROJECT_ID` configurado no Vercel
- [ ] `APPWRITE_API_KEY` configurado no Vercel
- [ ] `APPWRITE_DATABASE_ID` configurado no Vercel
- [ ] `JWT_SECRET` configurado no Vercel (use um valor forte!)
- [ ] `JWT_EXPIRES_IN` configurado no Vercel
- [ ] `CORS_ORIGIN` configurado com domínios corretos
- [ ] Todas as variáveis estão definidas para o ambiente correto (Production/Preview)

### 3. Segurança
- [ ] Nenhuma credencial hardcoded no código
- [ ] `.env` e `.env.local` estão no `.gitignore`
- [ ] JWT_SECRET é único e forte (mínimo 32 caracteres)
- [ ] CORS_ORIGIN está restrito aos domínios necessários
- [ ] Rate limiting configurado (se aplicável)

### 4. Configuração do Vercel
- [ ] `vercel.json` está correto
- [ ] Rotas `/api/*` estão configuradas
- [ ] Build command está correto
- [ ] Output directory está correto (`apps/web/dist`)
- [ ] `.vercelignore` exclui arquivos desnecessários

## 🚀 Deploy

### Deploy de Preview (para testes)
```bash
vercel
```

### Deploy de Produção
```bash
vercel --prod
```

### Via GitHub (Automático)
```bash
git push origin feat/vercel  # ou main
```

## ✨ Pós-Deploy

### 1. Verificação Básica
- [ ] Site está acessível no domínio
- [ ] Página inicial carrega corretamente
- [ ] Assets estáticos estão carregando (CSS, JS, imagens)
- [ ] Não há erros 404 no console

### 2. Verificação da API
- [ ] Endpoint de health check responde: `GET /api/health`
- [ ] Autenticação funciona: `POST /api/auth/login`
- [ ] CORS permite requisições do frontend
- [ ] Cookies estão sendo setados corretamente

### 3. Testes Funcionais
- [ ] Login/Logout funciona
- [ ] Criação de conta funciona
- [ ] Dashboard carrega dados reais
- [ ] Transações são listadas corretamente
- [ ] Integrações funcionam (se aplicável)

### 4. Performance
- [ ] Tempo de resposta da API < 2s
- [ ] Cold start < 3s
- [ ] Lighthouse score > 90 (se possível)
- [ ] Sem memory leaks visíveis

### 5. Monitoramento
- [ ] Logs estão aparecendo no Vercel Dashboard
- [ ] Sem erros críticos nos logs
- [ ] Métricas de função estão normais
- [ ] Alertas configurados (opcional)

## 🔍 Troubleshooting

### Se o deploy falhar:

1. **Verifique os logs no Vercel Dashboard**
   - Build logs
   - Function logs
   - Runtime logs

2. **Erros comuns:**
   - Falta de variáveis de ambiente
   - Dependências em `devDependencies` que deveriam estar em `dependencies`
   - Timeout em funções (limite de 10s no plano Hobby)
   - Problemas com o Appwrite (conexão, credenciais)

3. **Teste localmente primeiro:**
   ```bash
   vercel dev  # Simula ambiente do Vercel
   ```

4. **Verifique as configurações:**
   - `vercel.json` está correto?
   - `api/index.js` está apontando para o handler certo?
   - Build está gerando `dist/serverless.js`?

## 📊 Comandos Úteis

### Ver logs em tempo real
```bash
vercel logs [deployment-url] --follow
```

### Listar deployments
```bash
vercel list
```

### Remover um deployment
```bash
vercel remove [deployment-id]
```

### Ver variáveis de ambiente
```bash
vercel env ls
```

### Adicionar variável de ambiente
```bash
vercel env add [VARIABLE_NAME]
```

## 🎯 Métricas de Sucesso

Após o deploy, verifique:
- ✅ Uptime > 99.9%
- ✅ P95 response time < 2s
- ✅ Error rate < 1%
- ✅ Cold start < 3s
- ✅ Zero critical bugs

## 📚 Documentos Relacionados

- [VERCEL-SERVERLESS-GUIDE.md](./VERCEL-SERVERLESS-GUIDE.md) - Guia completo
- [VERCEL-DEPLOY.md](../VERCEL-DEPLOY.md) - Instruções de deploy
- [APPWRITE-SETUP.md](../APPWRITE-SETUP.md) - Configuração do Appwrite

## 🆘 Suporte

Se encontrar problemas:
1. Consulte a [documentação do Vercel](https://vercel.com/docs)
2. Verifique os logs no Dashboard
3. Teste localmente com `vercel dev`
4. Revise este checklist novamente
