# 🚀 Guia de Configuração - Appwrite Database

## 📋 Visão Geral

Este projeto utiliza o **Appwrite** como backend para gerenciar o banco de dados de perfil de usuários, preferências e configurações. O Appwrite fornece uma API completa, autenticação integrada e um painel de administração.

## 🎯 Por que Appwrite?

- ✅ **Backend-as-a-Service** completo
- ✅ **Autenticação** integrada
- ✅ **Database** NoSQL flexível com relações
- ✅ **Storage** para arquivos (avatars, documentos)
- ✅ **Real-time** subscriptions
- ✅ **Cloud Functions** para lógica customizada
- ✅ **Console Web** para administração
- ✅ **SDK TypeScript** type-safe

## 🛠️ Passo 1: Criar Conta no Appwrite

### Opção A: Appwrite Cloud (Recomendado)

1. Acesse: https://cloud.appwrite.io
2. Crie uma conta gratuita
3. Crie um novo projeto chamado "Horizon AI"
4. Anote o **Project ID**

### Opção B: Self-Hosted

```bash
docker run -d \
  --name appwrite \
  -p 80:80 \
  -p 443:443 \
  -v appwrite_data:/storage \
  appwrite/appwrite:latest
```

## 🔑 Passo 2: Obter Credenciais

### 2.1. Project ID

No Appwrite Console:

1. Vá para **Settings** > **General**
2. Copie o **Project ID**

### 2.2. API Key

No Appwrite Console:

1. Vá para **Settings** > **API Keys**
2. Clique em **Add API Key**
3. Nome: `Horizon AI Server`
4. Expiration: Nunca (ou configure como preferir)
5. Scopes: Selecione **ALL** (para desenvolvimento)
6. Copie a **API Key** gerada

### 2.3. Configurar .env

Adicione ao arquivo `.env` ou `.env.local` na raiz do projeto:

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id-here
APPWRITE_API_KEY=your-api-key-here
APPWRITE_DATABASE_ID=horizon_ai_db
```

**⚠️ IMPORTANTE**: Nunca commite o arquivo `.env` com suas credenciais reais!

## 📦 Passo 3: Criar Database

No Appwrite Console:

1. Vá para **Databases**
2. Clique em **Add Database**
3. Database ID: `horizon_ai_db`
4. Name: `Horizon AI Database`
5. Clique em **Create**

## 🗄️ Passo 4: Criar Collections

Você precisa criar 4 collections. Para cada uma:

### 4.1. Collection: Users

**Configuração Básica:**

- Collection ID: `users`
- Name: `Users`

**Atributos:**

| Key               | Type     | Size | Required | Default | Array |
| ----------------- | -------- | ---- | -------- | ------- | ----- |
| email             | String   | 255  | ✅       | -       | ❌    |
| password_hash     | String   | 1000 | ✅       | -       | ❌    |
| is_email_verified | Boolean  | -    | ✅       | false   | ❌    |
| is_active         | Boolean  | -    | ✅       | true    | ❌    |
| last_login_at     | DateTime | -    | ❌       | -       | ❌    |

**Índices:**

- email_idx: UNIQUE on `email`
- is_active_idx: KEY on `is_active`

**Permissions:**

```
Read: users
Write: users
Create: users
Update: users
Delete: users
```

---

### 4.2. Collection: User Profiles

**Configuração Básica:**

- Collection ID: `user_profiles`
- Name: `User Profiles`

**Atributos:**

| Key           | Type     | Size  | Required | Default | Array |
| ------------- | -------- | ----- | -------- | ------- | ----- |
| user_id       | String   | 255   | ✅       | -       | ❌    |
| first_name    | String   | 100   | ❌       | -       | ❌    |
| last_name     | String   | 100   | ❌       | -       | ❌    |
| display_name  | String   | 200   | ❌       | -       | ❌    |
| avatar_url    | String   | 1000  | ❌       | -       | ❌    |
| phone_number  | String   | 20    | ❌       | -       | ❌    |
| date_of_birth | DateTime | -     | ❌       | -       | ❌    |
| address       | String   | 10000 | ❌       | -       | ❌    |
| bio           | String   | 2000  | ❌       | -       | ❌    |
| occupation    | String   | 100   | ❌       | -       | ❌    |
| company       | String   | 100   | ❌       | -       | ❌    |
| website       | String   | 255   | ❌       | -       | ❌    |
| social_links  | String   | 2000  | ❌       | -       | ❌    |

**Índices:**

- user_id_idx: UNIQUE on `user_id`

**Permissions:** Same as Users

---

### 4.3. Collection: User Preferences

**Configuração Básica:**

- Collection ID: `user_preferences`
- Name: `User Preferences`

**Atributos:**

| Key                         | Type    | Size  | Required | Default  | Array |
| --------------------------- | ------- | ----- | -------- | -------- | ----- |
| user_id                     | String  | 255   | ✅       | -        | ❌    |
| theme                       | String  | 20    | ✅       | system   | ❌    |
| language                    | String  | 10    | ✅       | pt-BR    | ❌    |
| currency                    | String  | 10    | ✅       | BRL      | ❌    |
| default_dashboard_view      | String  | 50    | ❌       | overview | ❌    |
| dashboard_widgets           | String  | 10000 | ❌       | -        | ❌    |
| email_notifications         | Boolean | -     | ✅       | true     | ❌    |
| push_notifications          | Boolean | -     | ✅       | true     | ❌    |
| sms_notifications           | Boolean | -     | ✅       | false    | ❌    |
| notification_frequency      | String  | 20    | ✅       | realtime | ❌    |
| show_balances               | Boolean | -     | ✅       | true     | ❌    |
| auto_categorization_enabled | Boolean | -     | ✅       | true     | ❌    |
| budget_alerts               | Boolean | -     | ✅       | true     | ❌    |
| profile_visibility          | String  | 20    | ✅       | private  | ❌    |
| share_data_for_insights     | Boolean | -     | ✅       | false    | ❌    |

**Índices:**

- user_id_idx: UNIQUE on `user_id`

**Permissions:** Same as Users

---

### 4.4. Collection: User Settings

**Configuração Básica:**

- Collection ID: `user_settings`
- Name: `User Settings`

**Atributos:**

| Key                      | Type     | Size  | Required | Default | Min | Max  | Array |
| ------------------------ | -------- | ----- | -------- | ------- | --- | ---- | ----- |
| user_id                  | String   | 255   | ✅       | -       | -   | -    | ❌    |
| two_factor_enabled       | Boolean  | -     | ✅       | false   | -   | -    | ❌    |
| two_factor_method        | String   | 20    | ❌       | -       | -   | -    | ❌    |
| session_timeout          | Integer  | -     | ✅       | 30      | 5   | 1440 | ❌    |
| password_last_changed_at | DateTime | -     | ❌       | -       | -   | -    | ❌    |
| auto_sync_enabled        | Boolean  | -     | ✅       | true    | -   | -    | ❌    |
| sync_frequency           | Integer  | -     | ✅       | 60      | 1   | 1440 | ❌    |
| cloud_backup_enabled     | Boolean  | -     | ✅       | true    | -   | -    | ❌    |
| connected_banks          | String   | 50000 | ❌       | -       | -   | -    | ❌    |
| connected_apps           | String   | 50000 | ❌       | -       | -   | -    | ❌    |
| beta_features            | Boolean  | -     | ✅       | false   | -   | -    | ❌    |
| analytics_opt_in         | Boolean  | -     | ✅       | true    | -   | -    | ❌    |
| custom_settings          | String   | 50000 | ❌       | -       | -   | -    | ❌    |

**Índices:**

- user_id_idx: UNIQUE on `user_id`
- two_factor_enabled_idx: KEY on `two_factor_enabled`

**Permissions:** Same as Users

## ✅ Passo 5: Verificar Configuração

Execute o script de verificação:

```bash
cd apps/api
./scripts/setup-appwrite-db.sh
```

Ou teste diretamente na API:

```bash
pnpm dev
```

E faça uma requisição:

```bash
curl http://localhost:3000/health
```

## 🧪 Passo 6: Testar as Collections

### Criar Usuário Completo

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

### Buscar Dados do Usuário

```bash
curl http://localhost:3000/users/:userId
```

### Atualizar Tema

```bash
curl -X PATCH http://localhost:3000/users/:userId/theme \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark"}'
```

## 📊 Visualizar Dados no Appwrite Console

1. Acesse o Appwrite Console
2. Vá para **Databases** > **horizon_ai_db**
3. Selecione uma collection
4. Visualize, edite ou delete documentos diretamente

## 🔒 Segurança e Permissões

### Permissões Recomendadas para Produção

Para cada collection, configure:

**Read/Write:**

```
Role: Any
Permission: Read
```

```
Role: Users
Permission: Write (own documents only)
```

**No Appwrite Console:**

1. Vá para a collection
2. Clique em **Settings** > **Permissions**
3. Configure:
   - `read("any")` - Qualquer um pode ler
   - `write("user:[USER_ID]")` - Apenas o próprio usuário pode escrever

## 🚀 Recursos Avançados do Appwrite

### Real-time Subscriptions

```typescript
import { client } from './appwrite.client';

client.subscribe('databases.horizon_ai_db.collections.users.documents', (response) => {
  console.log('Document updated:', response);
});
```

### Storage (Upload de Avatar)

```typescript
import { Storage } from 'node-appwrite';

const storage = new Storage(client);

const file = await storage.createFile('avatars', ID.unique(), avatarFile);
```

### Cloud Functions

Crie functions customizadas no Appwrite para lógica serverless.

## 🐛 Troubleshooting

### Erro: "Project not found"

✅ Verifique se o `APPWRITE_PROJECT_ID` está correto no `.env`

### Erro: "Invalid API key"

✅ Regenere a API key no Appwrite Console e atualize o `.env`

### Erro: "Database not found"

✅ Certifique-se de criar o database com ID `horizon_ai_db`

### Erro: "Collection not found"

✅ Verifique se todas as 4 collections foram criadas corretamente

## 📚 Documentação Adicional

- [Appwrite Docs](https://appwrite.io/docs)
- [Appwrite Database](https://appwrite.io/docs/products/databases)
- [Appwrite Node SDK](https://appwrite.io/docs/sdks#server)

## 🎯 Checklist de Configuração

- [ ] Conta criada no Appwrite Cloud
- [ ] Projeto criado com nome "Horizon AI"
- [ ] API Key gerada e copiada
- [ ] Arquivo `.env` configurado
- [ ] Database `horizon_ai_db` criado
- [ ] Collection `users` criada com todos os atributos
- [ ] Collection `user_profiles` criada
- [ ] Collection `user_preferences` criada
- [ ] Collection `user_settings` criada
- [ ] Índices criados em cada collection
- [ ] Permissões configuradas
- [ ] API testada com sucesso

---

**✅ Configuração completa! Seu backend Appwrite está pronto para uso!** 🎉
