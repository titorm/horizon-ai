# Criação Automática de Dados do Usuário no Sign Up

## O que foi implementado

Ao criar uma conta (sign up), o sistema agora cria automaticamente:

1. **User** (Appwrite Auth) - Gerenciamento de autenticação
2. **User Document** (Database) - Dados básicos do usuário
3. **User Profile** - Perfil completo com valores padrão
4. **User Preferences** - Preferências com valores padrão
5. **User Settings** - Configurações com valores padrão

## Fluxo de criação

```
POST /auth/sign-up
  │
  ├─> Appwrite Auth cria usuário (com ID único)
  │
  └─> Database cria 4 documents:
      ├─> users (com mesmo ID do Auth)
      ├─> user_profiles (valores padrão)
      ├─> user_preferences (valores padrão)
      └─> user_settings (valores padrão)
```

## Valores padrão criados

### User Profile

```json
{
  "user_id": "<user_id>",
  "first_name": "João",
  "last_name": "Silva",
  "display_name": "João Silva"
}
```

### User Preferences (valores padrão)

```json
{
  "user_id": "<user_id>",
  "theme": "system",
  "language": "pt-BR",
  "currency": "BRL",
  "default_dashboard_view": "overview",
  "email_notifications": true,
  "push_notifications": true,
  "sms_notifications": false,
  "notification_frequency": "realtime",
  "show_balances": true,
  "auto_categorization_enabled": true,
  "budget_alerts": true,
  "profile_visibility": "private",
  "share_data_for_insights": false
}
```

### User Settings (valores padrão)

```json
{
  "user_id": "<user_id>",
  "two_factor_enabled": false,
  "session_timeout": 30,
  "auto_sync_enabled": true,
  "sync_frequency": 60,
  "cloud_backup_enabled": true,
  "beta_features": false,
  "analytics_opt_in": true
}
```

## Arquivos modificados

### 1. `auth.module.ts`

- Adicionado `AppwriteUserServiceModule` nos imports
- Permite injetar `AppwriteUserService` no `AuthService`

### 2. `auth.service.ts`

- Injetado `AppwriteUserService` no construtor
- Modificado método `signUp()` para criar todos os dados após criar usuário no Auth
- Adicionado tratamento de erro caso a criação no database falhe
- O usuário ainda é criado no Auth mesmo se o database falhar (com log de erro)

### 3. `appwrite-user.service.ts`

- Adicionado novo método `initializeUserDataWithId()`
- Aceita um `userId` específico (do Appwrite Auth)
- Cria o document do usuário com o ID fornecido
- Cria automaticamente profile, preferences e settings com valores padrão

## Uso

### Exemplo de Sign Up

```bash
POST http://localhost:8811/auth/sign-up
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "SenhaSegura123",
  "firstName": "João",
  "lastName": "Silva"
}
```

### Resposta

```json
{
  "id": "676e3f8a002f5d9b8c4a",
  "email": "joao@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Verificar dados criados

```bash
# Buscar usuário completo
GET http://localhost:8811/users/676e3f8a002f5d9b8c4a

# Resposta inclui:
{
  "user": { ... },
  "profile": { ... },  // ✅ Criado automaticamente
  "preferences": { ... },  // ✅ Criado automaticamente
  "settings": { ... }  // ✅ Criado automaticamente
}
```

## Vantagens

1. **Experiência do usuário**: Dados já prontos após sign up
2. **Consistência**: Todos os usuários têm a estrutura completa
3. **Sem erros**: Endpoints de profile/preferences/settings sempre funcionam
4. **Valores sensatos**: Preferências padrão adequadas para novos usuários
5. **Flexibilidade**: Usuário pode customizar depois

## Tratamento de erros

- Se criar usuário no Auth falhar → Sign up falha
- Se criar dados no database falhar → Sign up continua (usuário criado no Auth)
- Log de erro é registrado para investigação
- Usuário pode fazer login normalmente
- Dados podem ser criados manualmente depois se necessário

## Logs

```
[AuthService] Sign up attempt for email: joao@example.com
[AuthService] User created successfully in Appwrite Auth: 676e3f8a002f5d9b8c4a
[AuthService] User data initialized successfully in database for user: 676e3f8a002f5d9b8c4a
```

Ou em caso de erro no database:

```
[AuthService] Sign up attempt for email: joao@example.com
[AuthService] User created successfully in Appwrite Auth: 676e3f8a002f5d9b8c4a
[AuthService] Failed to initialize user data in database: [erro]
```
