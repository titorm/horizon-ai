# 🐳 Setup PostgreSQL com Docker para Desenvolvimento

## Problema

Seu `DATABASE_URL` aponta para Supabase que não está acessível na sua rede.

## Solução: PostgreSQL Local com Docker

### ✅ Opção 1: Usar Docker (Recomendado - 1 minuto)

#### Pré-requisitos

- Docker instalado ([download](https://www.docker.com/products/docker-desktop))

#### Passo 1: Iniciar PostgreSQL

```bash
docker run -d \
  --name horizon-ai-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=horizon_ai \
  -p 5432:5432 \
  postgres:15
```

#### Passo 2: Verificar se está rodando

```bash
docker ps | grep horizon-ai-db
```

Deve mostrar algo como:

```text
f3d8e2a1c9b7   postgres:15   ...   horizon-ai-db
```

#### Passo 3: Atualizar .env.local

```bash
# Editar .env.local (na raiz do monorepo)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/horizon_ai
```

#### Passo 4: Aplicar migrations

```bash
pnpm db:push
```

✅ Pronto! Suas tabelas foram criadas localmente!

---

### ✅ Opção 2: PostgreSQL sem Docker (macOS com Homebrew)


```bash
# Instalar PostgreSQL
brew install postgresql@15

# Iniciar serviço
brew services start postgresql@15

# Criar banco de dados
createdb horizon_ai

# Conectar para testar
psql horizon_ai -c "SELECT 1"

# Atualizar .env.local
# DATABASE_URL=postgresql://postgres@localhost:5432/horizon_ai
```

---

### ✅ Opção 3: PostgreSQL sem Docker (Ubuntu/Debian)


```bash
# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Iniciar serviço
sudo service postgresql start

# Criar banco de dados
sudo -u postgres createdb horizon_ai

# Atualizar .env.local
# DATABASE_URL=postgresql://postgres@localhost:5432/horizon_ai
```

---

## 🔍 Verificar Conexão

```bash
# Testar conexão com seu DATABASE_URL
psql "$DATABASE_URL" -c "SELECT 1"

# Ou rodar o verificador
./test-db-setup.sh
```

---

## 📊 Após Configurar

```bash
# 1. Aplicar migrations
pnpm db:push

# 2. Ver dados em tempo real
pnpm db:studio
# Acesse: http://localhost:3000

# 3. Iniciar servidor
pnpm -F @horizon-ai/api dev
```

---

## 🛑 Parar o PostgreSQL (Docker)

```bash
# Parar o container
docker stop horizon-ai-db

# Remover (se quiser recomeçar do zero)
docker rm horizon-ai-db
```

---

## 🚀 Próximos Passos

1. Escolha a opção (Docker recomendado)
2. Execute os comandos
3. Atualize `.env.local`
4. Execute `pnpm db:push`
5. Comece a desenvolver!

---

## ❓ Troubleshooting

### Docker não está instalado

- [Instale Docker Desktop](https://www.docker.com/products/docker-desktop)

### Erro: "port 5432 already in use"

```bash
# Verificar se outro PostgreSQL está rodando
lsof -i :5432

# Ou usar outra porta
docker run -d \
  --name horizon-ai-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=horizon_ai \
  -p 5433:5432 \
  postgres:15

# Depois atualizar DATABASE_URL
# DATABASE_URL=postgresql://postgres:postgres@localhost:5433/horizon_ai
```

### Erro: "connection refused"

```bash
# Verificar se container está rodando
docker ps

# Se não está, iniciar novamente
docker start horizon-ai-db

# Aguarde alguns segundos e tente novamente
sleep 3 && psql "$DATABASE_URL" -c "SELECT 1"
```

---

## 💾 Persistência de Dados

Para manter dados entre reinicializações:

```bash
# Criar volume
docker volume create horizon-ai-data

# Usar com o container
docker run -d \
  --name horizon-ai-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=horizon_ai \
  -v horizon-ai-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15
```

---

**Comece com Docker - é o mais rápido!** 🚀
