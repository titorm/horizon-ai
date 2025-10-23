# Requirements Document

## Introduction

Este documento define os requisitos para migrar o projeto Horizon AI de uma arquitetura Turborepo (monorepo) para um projeto Next.js monolítico. A migração consolidará as aplicações web (React/Vite) e API (NestJS) em uma única aplicação Next.js 16 com App Router e React 19.2, convertendo todas as telas existentes em rotas do Next.js e integrando a API como API Routes ou Server Actions, aproveitando as novas features dessas versões.

## Glossary

- **Sistema**: O projeto Horizon AI após a migração para Next.js
- **Turborepo**: Ferramenta de build system para monorepos que está sendo substituída
- **App Router**: Sistema de roteamento baseado em sistema de arquivos do Next.js 16
- **Screen**: Componente React existente em apps/web/src/screens que representa uma página completa
- **API Route**: Endpoint de API do Next.js localizado em app/api
- **Server Action**: Função server-side do Next.js/React 19.2 que pode ser chamada diretamente de componentes
- **Monolito**: Aplicação única que consolida frontend e backend
- **NestJS Service**: Serviço backend existente que precisa ser migrado
- **Appwrite**: Backend-as-a-Service usado para banco de dados e autenticação
- **Migration File**: Arquivo de migração de banco de dados existente que deve ser preservado
- **Turbopack**: Build tool do Next.js 16 que substitui Webpack (estável)
- **React Compiler**: Otimizador automático do React 19.2 (experimental)
- **PPR**: Partial Prerendering, feature do Next.js 16 que combina static e dynamic rendering
- **use Hook**: Novo hook do React 19.2 para consumir Promises e Context
- **useOptimistic**: Hook do React 19.2 para updates otimistas na UI
- **useActionState**: Hook do React 19.2 para gerenciar estado de Server Actions

## Requirements

### Requirement 1

**User Story:** Como desenvolvedor, quero migrar a estrutura do projeto de Turborepo para Next.js, para que eu tenha uma aplicação monolítica mais simples de manter e deployar

#### Acceptance Criteria

1. THE Sistema SHALL criar uma nova estrutura de projeto Next.js 16 com App Router e Turbopack na raiz do repositório
2. THE Sistema SHALL remover as dependências do Turborepo (turbo.json, pnpm-workspace.yaml) após a migração
3. THE Sistema SHALL consolidar todas as dependências de apps/web e apps/api em um único package.json com React 19.2
4. THE Sistema SHALL preservar todos os arquivos de configuração essenciais (.env, .gitignore, tsconfig.json)
5. THE Sistema SHALL manter compatibilidade com Node.js >= 22 e pnpm >= 9
6. THE Sistema SHALL habilitar React Compiler (experimental) e Turbopack no next.config.js

### Requirement 2

**User Story:** Como desenvolvedor, quero converter todas as telas React existentes em rotas do Next.js, para que o roteamento seja gerenciado pelo App Router

#### Acceptance Criteria

1. WHEN uma Screen existente é migrada, THE Sistema SHALL criar uma rota correspondente em app/[nome-da-rota]/page.tsx
2. THE Sistema SHALL converter nomes de arquivos Screen para rotas kebab-case (ex: DashboardScreen.tsx → app/dashboard/page.tsx)
3. THE Sistema SHALL preservar toda a lógica e componentes UI de cada Screen
4. THE Sistema SHALL migrar componentes compartilhados (ui, layout, modals) para a estrutura do Next.js
5. THE Sistema SHALL implementar rotas especiais para páginas públicas (landing, login, register) e protegidas (dashboard, accounts)

### Requirement 3

**User Story:** Como desenvolvedor, quero migrar os serviços NestJS para API Routes ou Server Actions do Next.js, para que a API seja parte integral da aplicação Next.js

#### Acceptance Criteria

1. THE Sistema SHALL converter controllers NestJS em API Routes do Next.js em app/api/[endpoint]/route.ts
2. THE Sistema SHALL migrar services NestJS para funções utilitárias ou Server Actions
3. THE Sistema SHALL preservar toda a lógica de negócio dos serviços existentes
4. THE Sistema SHALL manter a integração com Appwrite (client, database adapter)
5. THE Sistema SHALL preservar os guards de autenticação e estratégias JWT

### Requirement 4

**User Story:** Como desenvolvedor, quero preservar o sistema de migrações de banco de dados, para que o histórico e estrutura do banco de dados sejam mantidos

#### Acceptance Criteria

1. THE Sistema SHALL migrar todos os arquivos de migration de apps/api/src/database/migrations para a nova estrutura
2. THE Sistema SHALL preservar o arquivo applied-migrations.json com o histórico de migrações aplicadas
3. THE Sistema SHALL manter os scripts de CLI para executar migrações (migrate:up, migrate:down, migrate:status)
4. THE Sistema SHALL preservar o schema do Appwrite (appwrite-schema.ts)
5. THE Sistema SHALL garantir que o migration runner continue funcional na nova estrutura

### Requirement 5

**User Story:** Como desenvolvedor, quero migrar os hooks e utilitários React, para que toda a lógica de estado e data fetching seja preservada e aproveite as novas features do React 19.2

#### Acceptance Criteria

1. THE Sistema SHALL migrar todos os custom hooks de apps/web/src/hooks para a estrutura do Next.js
2. THE Sistema SHALL adaptar hooks de data fetching para usar o novo hook 'use' do React 19.2 quando apropriado
3. THE Sistema SHALL implementar useOptimistic para updates otimistas em operações de CRUD
4. THE Sistema SHALL utilizar useActionState para gerenciar estado de Server Actions
5. THE Sistema SHALL preservar hooks de UI (useAccounts, useCreditCards, useTransactions, useFinancialInsights)
6. THE Sistema SHALL migrar utilitários e helpers mantendo a mesma funcionalidade
7. THE Sistema SHALL atualizar imports e referências para a nova estrutura de diretórios

### Requirement 6

**User Story:** Como desenvolvedor, quero configurar autenticação e middleware no Next.js, para que rotas protegidas sejam acessíveis apenas para usuários autenticados

#### Acceptance Criteria

1. THE Sistema SHALL implementar middleware do Next.js para proteção de rotas
2. THE Sistema SHALL migrar a lógica de autenticação JWT do NestJS para o Next.js
3. THE Sistema SHALL preservar a integração com Appwrite para autenticação
4. THE Sistema SHALL implementar Server Actions para login, logout e registro
5. THE Sistema SHALL proteger rotas do dashboard e funcionalidades privadas

### Requirement 7

**User Story:** Como desenvolvedor, quero configurar variáveis de ambiente e configuração, para que a aplicação Next.js tenha acesso a todas as configurações necessárias

#### Acceptance Criteria

1. THE Sistema SHALL consolidar variáveis de ambiente de apps/web/.env.local e apps/api/.env em um único arquivo .env.local
2. THE Sistema SHALL criar arquivo .env.example com todas as variáveis necessárias documentadas
3. THE Sistema SHALL configurar next.config.js com variáveis de ambiente públicas e privadas
4. THE Sistema SHALL preservar configurações do Appwrite (endpoint, project ID, database ID)
5. THE Sistema SHALL manter configurações de JWT, CORS e cookies

### Requirement 8

**User Story:** Como desenvolvedor, quero configurar o build e deploy para Vercel, para que a aplicação Next.js possa ser deployada facilmente

#### Acceptance Criteria

1. THE Sistema SHALL criar configuração vercel.json otimizada para Next.js
2. THE Sistema SHALL configurar scripts de build no package.json (build, dev, start)
3. THE Sistema SHALL garantir que o build do Next.js inclua todas as dependências necessárias
4. THE Sistema SHALL configurar output standalone para otimizar o tamanho do deploy
5. THE Sistema SHALL preservar documentação de deploy existente adaptada para Next.js

### Requirement 9

**User Story:** Como desenvolvedor, quero manter a estrutura de componentes UI, para que o design system seja preservado na migração

#### Acceptance Criteria

1. THE Sistema SHALL migrar todos os componentes UI de apps/web/src/components/ui para a estrutura do Next.js
2. THE Sistema SHALL preservar componentes de layout (header, sidebar, footer)
3. THE Sistema SHALL migrar modais (AddAccountModal, AddCreditCardModal) mantendo funcionalidade
4. THE Sistema SHALL preservar assets (BankLogos, Icons)
5. THE Sistema SHALL manter estilos e temas existentes

### Requirement 10

**User Story:** Como desenvolvedor, quero utilizar as novas features do React 19.2 e Next.js 16, para que a aplicação tenha melhor performance e developer experience

#### Acceptance Criteria

1. THE Sistema SHALL implementar Server Actions usando a sintaxe nativa do React 19.2
2. THE Sistema SHALL utilizar o hook 'use' para data fetching assíncrono em Client Components
3. THE Sistema SHALL implementar useOptimistic para feedback instantâneo em operações de CRUD
4. THE Sistema SHALL utilizar useFormStatus em componentes de formulário para indicar estado de submissão
5. THE Sistema SHALL habilitar Partial Prerendering (PPR) em rotas apropriadas
6. THE Sistema SHALL configurar Turbopack como build tool padrão
7. THE Sistema SHALL habilitar React Compiler (experimental) para otimização automática
8. THE Sistema SHALL utilizar as novas Async Request APIs (cookies, headers) do Next.js 16

### Requirement 11

**User Story:** Como desenvolvedor, quero documentar a nova estrutura do projeto, para que outros desenvolvedores entendam a arquitetura migrada

#### Acceptance Criteria

1. THE Sistema SHALL criar README.md atualizado com instruções de setup do Next.js 16
2. THE Sistema SHALL documentar a estrutura de diretórios do projeto migrado
3. THE Sistema SHALL criar guia de migração explicando mudanças principais
4. THE Sistema SHALL documentar diferenças entre a arquitetura antiga e nova
5. THE Sistema SHALL incluir exemplos de como adicionar novas rotas e API endpoints
6. THE Sistema SHALL documentar uso das novas features do React 19.2 e Next.js 16
