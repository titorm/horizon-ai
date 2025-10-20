# Horizon AI - API

Serviço de API backend para a plataforma Horizon AI, construído com NestJS.

## Características

- ✅ Autenticação com JWT
- ✅ Sistema de Sign In / Sign Up
- ✅ Gerenciamento de sessão com Cookies
- ✅ Validação de dados
- ✅ TypeORM para persistência de dados
- ✅ SQLite para desenvolvimento
- ✅ CORS configurável
- ✅ Testes com Jest

## Instalação

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
```

## Desenvolvimento

```bash
# Start development server with hot reload
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov
```

## Build e Produção

```bash
# Build the project
pnpm build

# Start production server
pnpm start:prod
```

## API Endpoints

### Autenticação

#### Sign Up

```
POST /auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Sign In

```
POST /auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: 200
{
  "message": "Signed in successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Get Current User

```
GET /auth/me
Authorization: Bearer <token>

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-10-20T00:00:00Z",
  "updatedAt": "2024-10-20T00:00:00Z"
}
```

#### Sign Out

```
POST /auth/sign-out

Response: 200
{
  "message": "Signed out successfully"
}
```

### Health Check

```
GET /health

Response: 200
{
  "status": "ok"
}
```

## Estrutura do Projeto

```
src/
├── auth/                 # Autenticação
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Guards de autenticação
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── entities/            # Entidades de banco de dados
│   └── user.entity.ts
├── health/              # Health check
│   ├── health.controller.ts
│   └── health.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Variáveis de Ambiente

Veja `.env.example` para todas as variáveis disponíveis.

- `PORT` - Porta do servidor (padrão: 3001)
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRATION` - Expiração do JWT (padrão: 7d)
- `COOKIE_MAX_AGE` - Tempo máximo do cookie em ms
- `COOKIE_SECURE` - Usar cookies seguros (HTTPS)
- `COOKIE_HTTP_ONLY` - Apenas HTTP (não acessível via JavaScript)
- `COOKIE_SAME_SITE` - Política SameSite para cookies

## Segurança

- ✅ Senhas com hash usando bcrypt
- ✅ Autenticação JWT com expiração
- ✅ Cookies HTTP-only e secure
- ✅ CORS configurável
- ✅ Validação de entrada com class-validator

## Licença

MIT
