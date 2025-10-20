# Migration Guide: SQLite → Supabase PostgreSQL

Este documento descreve as mudanças feitas para migrar de SQLite + TypeORM para Supabase PostgreSQL.

## 📊 Resumo das Mudanças

### Removido ❌

- `@nestjs/typeorm` - ORM não é mais necessário
- `typeorm` - Substituído por Supabase client
- `sqlite3` - Substituído por Supabase managed database
- Decoradores TypeORM (Entity, Column, etc)

### Adicionado ✅

- `@supabase/supabase-js` - Cliente oficial Supabase
- `uuid` - Para gerar UUIDs no backend
- `SupabaseService` - Serviço centralizado para acesso ao DB
- `SUPABASE_SETUP.md` - Guia completo de configuração

## 🔄 Mudanças de Código

### 1. Autenticação: Permanece igual ✅

JWT, cookies HTTP-only e Passport.js continuam funcionando exatamente igual:

- Sign Up / Sign In endpoints mantidos
- Bcrypt para password hashing
- JWT tokens com 7 dias de expiração
- Cookies secure com SameSite

### 2. Banco de Dados: TypeORM → Supabase Client

#### Antes (TypeORM):

```typescript
@InjectRepository(User)
private usersRepository: Repository<User>;

// Query
const user = await this.usersRepository.findOne({ where: { email } });
```

#### Depois (Supabase):

```typescript
constructor(private supabaseService: SupabaseService) {}

// Query
const { data: users } = await this.supabaseService
  .getUsersTable()
  .select()
  .eq('email', email)
  .limit(1);
const user = users[0] as User;
```

### 3. Arquitetura do Projeto

#### Antes:

```
src/
├── entities/user.entity.ts   (TypeORM Entity)
├── auth/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.module.ts       (com TypeOrmModule.forFeature([User]))
└── app.module.ts            (com TypeOrmModule.forRoot(...))
```

#### Depois:

```
src/
├── supabase/
│   ├── supabase.service.ts  (novo - gerencia conexão)
│   ├── supabase.module.ts   (novo - injeta o serviço)
│   └── types.ts             (tipos do Supabase)
├── entities/user.entity.ts  (agora é uma interface simples)
├── auth/
│   ├── auth.service.ts      (usando Supabase client)
│   ├── auth.controller.ts   (sem mudanças)
│   └── auth.module.ts       (com SupabaseModule)
└── app.module.ts            (com SupabaseModule, sem TypeOrm)
```

## 🚀 Benefícios

| Aspecto            | SQLite + TypeORM | Supabase PostgreSQL   |
| ------------------ | ---------------- | --------------------- |
| **Banco**          | SQLite local     | PostgreSQL gerenciado |
| **Escalabilidade** | Limitada         | Ilimitada             |
| **Backup**         | Manual           | Automático            |
| **Performance**    | Arquivo no disk  | Servidor dedicado     |
| **Replicação**     | Não              | Sim                   |
| **Segurança**      | Básica           | Enterprise-grade      |
| **Custo**          | Grátis (local)   | Grátis (tier) + pago  |
| **Setup Produção** | Complexo         | Trivial               |

## 🔧 Variáveis de Ambiente

### Antes:

```bash
DATABASE_TYPE=sqlite
DATABASE_DATABASE=./data/app.db
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d
```

### Depois:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-publica
JWT_SECRET=sua-chave-secreta
```

## 📚 Operações Comuns

### Criar Usuário

#### TypeORM:

```typescript
const user = this.usersRepository.create({ email, password: hashed });
await this.usersRepository.save(user);
```

#### Supabase:

```typescript
const { data: user, error } = await this.supabaseService
  .getUsersTable()
  .insert({ id: uuid, email, password: hashed, createdAt: now, updatedAt: now })
  .select()
  .single();
```

### Buscar Usuário

#### TypeORM:

```typescript
const user = await this.usersRepository.findOne({ where: { email } });
```

#### Supabase:

```typescript
const { data: users } = await this.supabaseService.getUsersTable().select().eq('email', email).limit(1);
const user = users[0];
```

### Atualizar Usuário

#### TypeORM:

```typescript
user.firstName = 'John';
await this.usersRepository.save(user);
```

#### Supabase:

```typescript
const { data: updated } = await this.supabaseService
  .getUsersTable()
  .update({ firstName: 'John', updatedAt: now })
  .eq('id', userId)
  .select()
  .single();
```

## ✅ Checklist de Validação

- [x] Dependências atualizadas (package.json)
- [x] TypeORM removido (imports e modules)
- [x] SupabaseService criado
- [x] AuthService refatorado
- [x] AppModule simplificado
- [x] .env.example atualizado
- [x] Build sem erros
- [x] SUPABASE_SETUP.md documentado

## 📖 Próximas Etapas

1. **Setup Supabase**: Seguir [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. **Testar endpoints**: Usar [API_EXAMPLES.md](./API_EXAMPLES.md)
3. **Integrar com frontend**: Ver [FRONTEND_INTEGRATION.ts](./FRONTEND_INTEGRATION.ts)
4. **Deploy**: Configurar credenciais Supabase em produção

## 🆘 FAQ

### P: E meus dados existentes no SQLite?

**R**: Se você tinha dados no SQLite, precisará fazer export/import para Supabase. Veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para detalhes.

### P: Preciso alterar meu frontend?

**R**: Não! A API mantém os mesmos endpoints. Frontend continua funcionando igual.

### P: Posso usar sem Supabase?

**R**: Você pode manter TypeORM adicionando `@nestjs/typeorm` e `typeorm` novamente, mas Supabase é recomendado.

### P: E refresh tokens?

**R**: Implementação futura. JWT atual expira em 7 dias.

---

**Migração completada**: ✅ Projeto agora usa Supabase PostgreSQL
