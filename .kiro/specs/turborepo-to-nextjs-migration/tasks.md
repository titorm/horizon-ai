# Implementation Plan

- [x] 1. Setup inicial do projeto Next.js 16
  - Criar novo projeto Next.js 16 com App Router e Turbopack na raiz do repositório
  - Configurar TypeScript com tsconfig.json apropriado
  - Instalar React 19.2 e React DOM 19.2
  - Instalar e configurar Tailwind CSS
  - Configurar ESLint e Prettier
  - Habilitar Turbopack no next.config.js
  - Habilitar React Compiler (experimental) no next.config.js
  - Habilitar Partial Prerendering (PPR) experimental
  - Criar estrutura de diretórios base (app, components, lib, hooks, actions)
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 10.6, 10.7_

- [x] 2. Configurar variáveis de ambiente e configuração
  - Consolidar variáveis de ambiente de apps/web/.env.local e apps/api/.env em .env.local
  - Criar arquivo .env.example com todas as variáveis documentadas
  - Configurar next.config.js com variáveis de ambiente e otimizações
  - Validar configurações do Appwrite (endpoint, project ID, database ID)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 3. Migrar tipos e interfaces compartilhadas
  - Criar lib/types/index.ts com todas as interfaces TypeScript
  - Migrar tipos de User, Account, Transaction, CreditCard
  - Migrar tipos de API responses e errors
  - Migrar constantes de apps/web/src/constants.ts
  - _Requirements: 1.4_

- [x] 4. Migrar cliente Appwrite e configurações
  - Criar lib/appwrite/client.ts com singleton do Appwrite Client
  - Migrar appwrite-schema.ts para lib/appwrite/schema.ts
  - Criar lib/appwrite/database.ts com helpers de database
  - Migrar appwrite-db-adapter.ts para lib/appwrite/adapter.ts
  - _Requirements: 3.4, 4.4_

- [x] 5. Migrar sistema de migrações de banco de dados
  - Criar lib/database/migrations/ e copiar todos os arquivos de migration
  - Migrar migration-runner.ts e migration.interface.ts
  - Migrar cli.ts para executar migrações
  - Copiar applied-migrations.json preservando histórico
  - Atualizar scripts no package.json (migrate:up, migrate:down, migrate:status)
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 6. Implementar autenticação JWT e utilitários
  - Criar lib/auth/jwt.ts com funções generateJWT e verifyJWT
  - Criar lib/auth/session.ts com getCurrentUser e helpers de sessão
  - Migrar lógica de JWT do NestJS (estratégias e guards)
  - Configurar cookies httpOnly para tokens usando Async Request APIs do Next.js 16
  - Adaptar para usar await cookies() conforme Next.js 16
  - _Requirements: 3.5, 6.2, 6.3, 10.8_

- [ ] 7. Implementar middleware de autenticação
  - Criar app/middleware.ts para proteção de rotas
  - Implementar verificação de JWT em rotas protegidas
  - Configurar redirecionamentos (login para não autenticados, overview para autenticados)
  - Definir rotas públicas e protegidas
  - _Requirements: 6.1, 6.4, 6.5_

- [ ] 8. Migrar services do NestJS para lib/services
- [ ] 8.1 Migrar auth.service.ts
  - Criar lib/services/auth.service.ts com funções signIn, signUp, signOut
  - Migrar lógica de autenticação do NestJS AuthService
  - Integrar com Appwrite Account API
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8.2 Migrar user.service.ts
  - Criar lib/services/user.service.ts
  - Migrar appwrite-user.service.ts do NestJS
  - Implementar funções de CRUD de usuários
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8.3 Migrar account.service.ts
  - Criar lib/services/account.service.ts
  - Migrar appwrite-account.service.ts do NestJS
  - Implementar funções de CRUD de contas bancárias
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8.4 Migrar credit-card.service.ts
  - Criar lib/services/credit-card.service.ts
  - Migrar appwrite-credit-card.service.ts do NestJS
  - Implementar funções de CRUD de cartões de crédito
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8.5 Migrar transaction.service.ts
  - Criar lib/services/transaction.service.ts
  - Migrar appwrite-transaction.service.ts do NestJS
  - Implementar funções de CRUD de transações e estatísticas
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 9. Criar API Routes para autenticação
- [ ] 9.1 Criar API Route de sign-in
  - Criar app/api/auth/sign-in/route.ts
  - Implementar POST handler com validação
  - Integrar com auth.service.ts
  - Configurar cookie de autenticação
  - _Requirements: 3.1_

- [ ] 9.2 Criar API Route de sign-up
  - Criar app/api/auth/sign-up/route.ts
  - Implementar POST handler com validação
  - Integrar com auth.service.ts
  - Configurar cookie de autenticação
  - _Requirements: 3.1_

- [ ] 9.3 Criar API Route de sign-out
  - Criar app/api/auth/sign-out/route.ts
  - Implementar POST handler
  - Limpar cookie de autenticação
  - _Requirements: 3.1_

- [ ] 9.4 Criar API Route de me (current user)
  - Criar app/api/auth/me/route.ts
  - Implementar GET handler
  - Retornar dados do usuário autenticado
  - _Requirements: 3.1_

- [ ] 10. Criar API Routes para usuários
  - Criar app/api/users/profile/route.ts com GET e PATCH handlers
  - Integrar com user.service.ts
  - Implementar validação de dados
  - _Requirements: 3.1_

- [ ] 11. Criar API Routes para contas bancárias
- [ ] 11.1 Criar API Routes base de accounts
  - Criar app/api/accounts/route.ts com GET (list) e POST (create) handlers
  - Integrar com account.service.ts
  - Implementar validação de dados
  - _Requirements: 3.1_

- [ ] 11.2 Criar API Routes de account por ID
  - Criar app/api/accounts/[id]/route.ts com GET, PATCH e DELETE handlers
  - Integrar com account.service.ts
  - Implementar validação de ownership
  - _Requirements: 3.1_

- [ ] 12. Criar API Routes para cartões de crédito
- [ ] 12.1 Criar API Routes base de credit-cards
  - Criar app/api/credit-cards/route.ts com POST (create) handler
  - Integrar com credit-card.service.ts
  - _Requirements: 3.1_

- [ ] 12.2 Criar API Routes de credit-card por ID
  - Criar app/api/credit-cards/[id]/route.ts com GET, PATCH e DELETE handlers
  - Integrar com credit-card.service.ts
  - _Requirements: 3.1_

- [ ] 12.3 Criar API Route de credit-cards por account
  - Criar app/api/credit-cards/account/[accountId]/route.ts com GET handler
  - Listar cartões de uma conta específica
  - _Requirements: 3.1_

- [ ] 13. Criar API Routes para transações
- [ ] 13.1 Criar API Routes base de transactions
  - Criar app/api/transactions/route.ts com GET (list) handler
  - Integrar com transaction.service.ts
  - Implementar filtros e paginação
  - _Requirements: 3.1_

- [ ] 13.2 Criar API Route de transação manual
  - Criar app/api/transactions/manual/route.ts com POST handler
  - Permitir criação manual de transações
  - _Requirements: 3.1_

- [ ] 13.3 Criar API Routes de transaction por ID
  - Criar app/api/transactions/[id]/route.ts com GET, PATCH e DELETE handlers
  - Integrar com transaction.service.ts
  - _Requirements: 3.1_

- [ ] 13.4 Criar API Route de estatísticas
  - Criar app/api/transactions/stats/[userId]/route.ts com GET handler
  - Retornar estatísticas de transações do usuário
  - _Requirements: 3.1_

- [ ] 14. Migrar componentes UI
  - Criar components/ui/ e migrar todos os componentes de apps/web/src/components/ui
  - Migrar Button, Card, Input, Modal, Toast, Badge, Tabs, Stepper, Spinner, Skeleton, DropdownMenu
  - Atualizar imports para usar '@/components/ui'
  - Garantir compatibilidade com Server e Client Components
  - _Requirements: 9.1_

- [ ] 15. Migrar componentes de layout
  - Criar components/layout/ e migrar DashboardLayout, Header, Sidebar, Footer
  - Adaptar DashboardLayout para receber user como prop
  - Atualizar navegação para usar Next.js Link e useRouter
  - Garantir que layout funcione como Client Component
  - _Requirements: 9.2_

- [ ] 16. Migrar componentes de modais
  - Criar components/modals/ e migrar AddAccountModal, AddCreditCardModal
  - Atualizar para usar API Routes do Next.js
  - Adaptar para Client Components
  - _Requirements: 9.3_

- [ ] 17. Migrar assets e ícones
  - Criar components/assets/ e migrar BankLogos.tsx, Icons.tsx
  - Copiar arquivos estáticos para public/assets/
  - Atualizar referências de imagens
  - _Requirements: 9.4_

- [ ] 18. Migrar custom hooks com React 19.2 features
  - Criar hooks/ e migrar useAccounts, useCreditCards, useTransactions, useFinancialInsights, useTotalBalance
  - Adaptar hooks para usar o novo hook 'use' do React 19.2 para data fetching
  - Implementar versões com useOptimistic para updates otimistas
  - Criar hooks auxiliares usando useFormStatus para indicadores de loading
  - Marcar hooks como 'use client'
  - Atualizar endpoints para nova estrutura de API
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 10.2, 10.3, 10.4_

- [ ] 19. Migrar utilitários
  - Criar lib/utils/ e migrar random-name.generator.ts
  - Migrar outros utilitários necessários
  - _Requirements: 5.4_

- [ ] 20. Criar layouts do App Router
- [ ] 20.1 Criar root layout
  - Criar app/layout.tsx com metadata e estrutura HTML base
  - Importar globals.css com Tailwind
  - Configurar fontes se necessário
  - _Requirements: 2.3_

- [ ] 20.2 Criar layout de autenticação
  - Criar app/(auth)/layout.tsx para páginas públicas
  - Implementar layout simples sem sidebar
  - _Requirements: 2.5_

- [ ] 20.3 Criar layout de app protegido
  - Criar app/(app)/layout.tsx com DashboardLayout
  - Buscar usuário atual no servidor
  - Redirecionar se não autenticado
  - _Requirements: 2.5, 6.5_

- [ ] 21. Criar páginas públicas
- [ ] 21.1 Criar landing page
  - Criar app/page.tsx migrando LandingScreen
  - Adaptar para Server Component onde possível
  - Atualizar navegação para usar Next.js Link
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 21.2 Criar página de login
  - Criar app/(auth)/login/page.tsx migrando LoginScreen
  - Integrar com API Route de sign-in
  - Implementar redirecionamento após login
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 21.3 Criar página de registro
  - Criar app/(auth)/register/page.tsx migrando RegisterScreen
  - Integrar com API Route de sign-up
  - Implementar redirecionamento após registro
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 21.4 Criar página de pricing
  - Criar app/pricing/page.tsx migrando PricingScreen
  - Manter como página pública
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 22. Criar páginas protegidas principais
- [ ] 22.1 Criar página de overview
  - Criar app/(app)/overview/page.tsx migrando DashboardOverviewScreen
  - Integrar com hooks de dados (useAccounts, useTransactions, useFinancialInsights)
  - Implementar loading states
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 22.2 Criar página de accounts
  - Criar app/(app)/accounts/page.tsx migrando AccountsScreen
  - Integrar com useAccounts hook
  - Implementar modais de adicionar/editar conta
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 22.3 Criar página de transactions
  - Criar app/(app)/transactions/page.tsx migrando TransactionsScreen
  - Integrar com useTransactions hook
  - Implementar filtros e paginação
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 22.4 Criar página de categories
  - Criar app/(app)/categories/page.tsx migrando CategoriesScreen
  - Implementar gerenciamento de categorias
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 23. Criar páginas protegidas financeiras
- [ ] 23.1 Criar página de analytics
  - Criar app/(app)/analytics/page.tsx migrando AnalyticsScreen
  - Integrar com dados de transações e insights
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 23.2 Criar página de credit
  - Criar app/(app)/credit/page.tsx migrando CreditScreen
  - Integrar com useCreditCards hook
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 23.3 Criar página de invoices
  - Criar app/(app)/invoices/page.tsx migrando InvoicesScreen
  - Implementar lógica de upgrade para premium
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 23.4 Criar página de taxes
  - Criar app/(app)/taxes/page.tsx migrando TaxScreen
  - Implementar funcionalidades de impostos
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 23.5 Criar página de warranties
  - Criar app/(app)/warranties/page.tsx migrando WarrantiesScreen
  - Implementar gerenciamento de garantias
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 24. Criar páginas protegidas de planejamento
- [ ] 24.1 Criar página de planning-goals
  - Criar app/(app)/planning-goals/page.tsx migrando PlanningGoalsScreen
  - Implementar gerenciamento de metas
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 24.2 Criar página de shopping-list
  - Criar app/(app)/shopping-list/page.tsx migrando ShoppingListScreen
  - Implementar lista de compras
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 24.3 Criar página de succession
  - Criar app/(app)/succession/page.tsx migrando SuccessionScreen
  - Implementar planejamento sucessório
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 24.4 Criar página de insurance
  - Criar app/(app)/insurance/page.tsx migrando InsuranceScreen
  - Implementar gerenciamento de seguros
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 24.5 Criar página de retirement
  - Criar app/(app)/retirement/page.tsx migrando RetirementScreen
  - Implementar planejamento de aposentadoria
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 25. Criar páginas protegidas de gestão
- [ ] 25.1 Criar página de family
  - Criar app/(app)/family/page.tsx migrando FamilyScreen
  - Implementar gestão familiar
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 25.2 Criar página de compliance
  - Criar app/(app)/compliance/page.tsx migrando ComplianceScreen
  - Implementar funcionalidades de compliance
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 25.3 Criar página de integrations
  - Criar app/(app)/integrations/page.tsx migrando IntegrationsScreen
  - Implementar gerenciamento de integrações
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 25.4 Criar página de marketplace
  - Criar app/(app)/marketplace/page.tsx migrando MarketplaceScreen
  - Implementar marketplace de serviços
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 26. Criar páginas protegidas de configuração
- [ ] 26.1 Criar página de notifications
  - Criar app/(app)/notifications/page.tsx migrando NotificationsScreen
  - Implementar centro de notificações
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 26.2 Criar página de settings
  - Criar app/(app)/settings/page.tsx migrando SettingsScreen
  - Implementar configurações do usuário
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 26.3 Criar página de help
  - Criar app/(app)/help/page.tsx migrando HelpScreen
  - Implementar central de ajuda
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 27. Criar Server Actions com React 19.2
  - Criar actions/auth.actions.ts com loginAction, logoutAction, registerAction usando sintaxe React 19.2
  - Criar actions/account.actions.ts para operações de contas
  - Criar actions/transaction.actions.ts para operações de transações
  - Implementar usando Async Request APIs (await cookies(), await headers())
  - Adicionar suporte para useActionState nos componentes que consomem as actions
  - Implementar como alternativa às API Routes onde apropriado
  - _Requirements: 3.1, 3.2, 10.1, 10.8_

- [ ] 27.1 Implementar componentes com React 19.2 features
  - Criar componentes de formulário usando useFormStatus para loading states
  - Implementar componentes com useOptimistic para feedback instantâneo
  - Criar exemplos de uso do hook 'use' para data fetching
  - Implementar componentes que usam useActionState para gerenciar estado de actions
  - Adicionar Suspense boundaries apropriados para PPR
  - _Requirements: 10.2, 10.3, 10.4, 10.5_

- [ ] 28. Configurar build e otimizações Next.js 16
  - Configurar next.config.js com output standalone
  - Habilitar e configurar Turbopack (stable no Next.js 16)
  - Habilitar React Compiler (experimental) para otimização automática
  - Configurar Partial Prerendering (PPR) experimental
  - Configurar otimizações de imagem (AVIF, WebP)
  - Configurar variáveis de ambiente públicas
  - Configurar Server Actions (bodySizeLimit, allowedOrigins)
  - Configurar compiler options (removeConsole em produção)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.5, 10.6, 10.7_

- [ ] 29. Atualizar package.json e scripts
  - Consolidar dependências de apps/web e apps/api
  - Instalar Next.js 16 e React 19.2
  - Atualizar scripts (dev com Turbopack, build, start, lint, typecheck)
  - Remover dependências do Turborepo
  - Adicionar scripts de migração de banco de dados
  - Verificar compatibilidade de todas as dependências com React 19.2
  - _Requirements: 1.2, 1.3, 1.6, 8.2_

- [ ] 30. Criar documentação
- [ ] 30.1 Atualizar README.md
  - Documentar nova estrutura do projeto Next.js 16
  - Adicionar instruções de setup e desenvolvimento com Turbopack
  - Documentar comandos disponíveis
  - Documentar features do React 19.2 utilizadas
  - _Requirements: 11.1, 11.2, 11.6_

- [ ] 30.2 Criar guia de migração
  - Documentar mudanças principais da arquitetura
  - Explicar diferenças entre Turborepo e Next.js 16
  - Documentar breaking changes do React 19.2
  - Explicar migração de hooks para usar 'use', useOptimistic, useActionState
  - _Requirements: 11.3, 11.4, 11.6_

- [ ] 30.3 Criar guia de desenvolvimento
  - Documentar como adicionar novas rotas com PPR
  - Documentar como criar Server Actions com React 19.2
  - Documentar como adicionar novos API endpoints
  - Documentar padrões de código com React Compiler
  - Documentar uso de useOptimistic para updates otimistas
  - Documentar uso de useFormStatus em formulários
  - _Requirements: 11.5, 11.6_

- [ ] 31. Testes e validação
- [ ] 31.1 Testar fluxo de autenticação
  - Testar registro de novo usuário
  - Testar login com credenciais válidas e inválidas
  - Testar logout
  - Testar proteção de rotas
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 31.2 Testar CRUD de accounts
  - Testar criação de conta
  - Testar listagem de contas
  - Testar atualização de conta
  - Testar exclusão de conta
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 31.3 Testar CRUD de transactions
  - Testar criação de transação
  - Testar listagem com filtros
  - Testar atualização de transação
  - Testar exclusão de transação
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 31.4 Testar CRUD de credit cards
  - Testar criação de cartão
  - Testar listagem de cartões
  - Testar atualização de cartão
  - Testar exclusão de cartão
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 32. Preparar para deploy
  - Configurar vercel.json se necessário
  - Validar variáveis de ambiente para produção
  - Testar build de produção localmente
  - Criar checklist de deploy
  - _Requirements: 8.1, 8.5_

- [ ] 33. Limpeza e remoção de código antigo
  - Remover diretório apps/ após validação completa
  - Remover turbo.json e pnpm-workspace.yaml
  - Remover dependências não utilizadas
  - Limpar arquivos de configuração obsoletos
  - _Requirements: 1.2_
