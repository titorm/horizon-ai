# Integração de Dados Reais do Usuário nos Endpoints de Autenticação

## Mudanças Implementadas

Todos os endpoints de autenticação agora retornam **dados reais do banco de dados** ao invés de dados mockados ou apenas do Appwrite Auth.

## Endpoints Atualizados

### 1. `POST /auth/sign-up` - Cadastro

**Antes:**

```json
{
  "id": "676e3f8a002f5d9b8c4a",
  "email": "joao@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "accessToken": "eyJhbGc..."
}
```

**Agora:**

```json
{
  "id": "676e3f8a002f5d9b8c4a",
  "email": "joao@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "accessToken": "eyJhbGc...",
  "user": {
    "$id": "676e3f8a002f5d9b8c4a",
    "email": "joao@example.com",
    "password_hash": "managed_by_appwrite_auth",
    "is_email_verified": false,
    "is_active": true,
    "$createdAt": "2025-10-22T...",
    "$updatedAt": "2025-10-22T..."
  },
  "profile": {
    "$id": "...",
    "user_id": "676e3f8a002f5d9b8c4a",
    "first_name": "João",
    "last_name": "Silva",
    "display_name": "João Silva",
    "avatar_url": null,
    ...
  },
  "preferences": {
    "$id": "...",
    "user_id": "676e3f8a002f5d9b8c4a",
    "theme": "system",
    "language": "pt-BR",
    "currency": "BRL",
    ...
  },
  "settings": {
    "$id": "...",
    "user_id": "676e3f8a002f5d9b8c4a",
    "two_factor_enabled": false,
    "auto_sync_enabled": true,
    ...
  }
}
```

### 2. `POST /auth/sign-in` - Login

**Antes:**

```json
{
  "id": "676e3f8a002f5d9b8c4a",
  "email": "joao@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "accessToken": "eyJhbGc..."
}
```

**Agora:**

```json
{
  "id": "676e3f8a002f5d9b8c4a",
  "email": "joao@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "accessToken": "eyJhbGc...",
  "user": { ... },      // Dados completos do banco
  "profile": { ... },   // Perfil completo
  "preferences": { ... }, // Preferências
  "settings": { ... }   // Configurações
}
```

### 3. `GET /auth/me` - Usuário Logado

**Antes:**

```json
{
  "id": "676e3f8a002f5d9b8c4a",
  "email": "joao@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "accessToken": ""
}
```

**Agora:**

```json
{
  "id": "676e3f8a002f5d9b8c4a",
  "email": "joao@example.com",
  "emailVerification": false,
  "user": {
    "$id": "676e3f8a002f5d9b8c4a",
    "email": "joao@example.com",
    "is_email_verified": false,
    "is_active": true,
    ...
  },
  "profile": {
    "user_id": "676e3f8a002f5d9b8c4a",
    "first_name": "João",
    "last_name": "Silva",
    "display_name": "João Silva",
    "avatar_url": "https://...",
    "phone_number": "+55 11 98765-4321",
    "date_of_birth": "1990-01-01",
    "address": {
      "street": "Rua Example",
      "city": "São Paulo",
      "state": "SP",
      "country": "Brasil"
    },
    "bio": "Desenvolvedor Full Stack",
    ...
  },
  "preferences": {
    "theme": "dark",
    "language": "pt-BR",
    "currency": "BRL",
    "email_notifications": true,
    "push_notifications": true,
    "dashboard_widgets": {
      "enabled": ["transactions", "balance", "goals"],
      "order": ["balance", "transactions", "goals"]
    },
    ...
  },
  "settings": {
    "two_factor_enabled": true,
    "two_factor_method": "app",
    "session_timeout": 30,
    "auto_sync_enabled": true,
    "sync_frequency": 60,
    "connected_banks": [
      {
        "bankId": "nubank",
        "bankName": "Nubank",
        "isActive": true
      }
    ],
    ...
  }
}
```

## Arquivos Modificados

### 1. `auth.service.ts`

**Método `signUp()`:**

- Captura o retorno de `initializeUserDataWithId()` na variável `userData`
- Retorna todos os dados do usuário junto com o token

**Método `signIn()`:**

- Busca dados completos do banco com `getCompleteUserData()`
- Retorna user, profile, preferences e settings

**Método `getCurrentUser()`:**

- Valida no Appwrite Auth
- Busca dados completos do banco de dados
- Retorna estrutura completa com auth + dados do banco

### 2. `auth.controller.ts`

**Endpoint `GET /auth/me`:**

- Ajustado para retornar a estrutura completa retornada pelo service
- Inclui dados de auth, user, profile, preferences e settings

### 3. `auth/dto/index.ts`

**Interface `AuthResponseDto`:**

- Adicionados campos opcionais:
  - `user?: any` - Document do usuário
  - `profile?: any` - Document do perfil
  - `preferences?: any` - Document das preferências
  - `settings?: any` - Document das configurações

## Benefícios

### 1. **Dados Sempre Atualizados**

- Frontend recebe dados reais do banco de dados
- Não há inconsistência entre Auth e Database

### 2. **Menos Requisições**

- Sign up/Sign in já retornam todos os dados necessários
- Frontend não precisa fazer requisição adicional para `/users/:id`

### 3. **Experiência do Usuário**

- Dados completos disponíveis imediatamente após login
- Perfil, preferências e configurações já carregados

### 4. **Consistência**

- Todos os endpoints seguem o mesmo padrão
- Dados estruturados da mesma forma

## Fluxo de Dados

### Sign Up

```
1. Criar usuário no Appwrite Auth
   ↓
2. Criar documents no banco (user, profile, preferences, settings)
   ↓
3. Retornar dados completos + token
```

### Sign In

```
1. Validar credenciais no Appwrite Auth
   ↓
2. Buscar dados completos do banco
   ↓
3. Retornar dados completos + token
```

### GET /auth/me

```
1. Validar token JWT
   ↓
2. Validar usuário no Appwrite Auth
   ↓
3. Buscar dados completos do banco
   ↓
4. Retornar estrutura completa
```

## Uso no Frontend

### Exemplo com React/TypeScript

```typescript
// Login
const response = await fetch('/auth/sign-in', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();

// Acesso aos dados
console.log(data.user.email);
console.log(data.profile.first_name);
console.log(data.preferences.theme);
console.log(data.settings.two_factor_enabled);

// Armazenar no estado
setUser(data.user);
setProfile(data.profile);
setPreferences(data.preferences);
setSettings(data.settings);
```

### Exemplo com Context API

```typescript
interface AuthContext {
  user: User | null;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  settings: UserSettings | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [settings, setSettings] = useState(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    setUser(data.user);
    setProfile(data.profile);
    setPreferences(data.preferences);
    setSettings(data.settings);
  };

  return (
    <AuthContext.Provider value={{ user, profile, preferences, settings, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Notas Importantes

1. **Campos JSON são parseados**: `address`, `dashboard_widgets`, `connected_banks`, etc. são retornados como objetos JavaScript, não strings JSON.

2. **Dados podem ser null**: Se o usuário foi criado apenas no Auth (sem dados no banco), os campos `profile`, `preferences` e `settings` serão `null`.

3. **Token no cookie**: O `accessToken` é enviado tanto no corpo da resposta quanto no cookie HTTP-only.

4. **Validação dupla**: `/auth/me` valida tanto no JWT quanto no Appwrite Auth para máxima segurança.
