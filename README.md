# Checklist Completo do Projeto — Mini-Produto de Tarefas com IA

## 1️⃣ Requisitos Funcionais

- **Autenticação** ✅
  - JWT ou OAuth2 para login seguro.
  - Controle de acesso por usuário ou função (RBAC opcional).
- **CRUD de Tarefas** ✅
  - Criar, ler, atualizar e deletar tarefas.
- **Entrada de mensagens simulada** ✅
  - Receber pedidos via webhook simulando WhatsApp.
  - Transformar mensagens em tarefas no sistema.
- **IA integrada** ✅
  - Geração automática de título/descrição resumida (smartização).
  - Busca semântica usando embeddings para encontrar tarefas similares.
  - Priorização sugerida com probabilidade de urgência/impacto e explicação curta.
- **Interface Web (UI)** ✅
  - Login e autenticação.
  - Lista de tarefas com filtros, busca e paginação.
  - Exibir prioridade e justificativa da IA.

## 2️⃣ Requisitos Não Funcionais

- **Qualidade do código** ✅
  - Arquitetura organizada.
  - Padrões SOLID.
  - Código limpo e documentado.
- **Testes** ✅
  - Testes unitários e de integração da API.
  - Testes de UI (opcional).
- **Banco de dados** ✅
  - Relacional (PostgreSQL) ou NoSQL.
  - Índices para performance (priority, embedding, etc.).
  - Paginação em listagens grandes.
- **Logs e healthcheck** ✅
  - Logs de requisições e erros.
  - Endpoint `/health` para monitoramento.
- **Segurança** ✅
  - Validação de entradas do usuário.
  - Proteção contra acesso não autorizado.
- **Auditoria mínima** ✅
  - Registrar quem criou/atualizou cada tarefa e quando.

## 3️⃣ IA — Especificações mínimas

- **Smartização** ✅
  - Resumir texto livre em título/descrição curta.
- **Busca semântica** ✅
  - Embeddings para busca de tarefas relacionadas.
  - Cache simples de prompts/respostas (opcional).
- **Priorização** ✅
  - Sugestão de urgência/impacto com explicação curta.
- **Documentação do setup**
  - Explicar uso local ou via APIs externas (ex.: OpenAI).

## 4️⃣ Bônus (Opcional)

- **CI/CD** ✅
  - Pipeline automatizado para build/test/deploy.
- **Feature flags** ✅
  - Habilitar ou desabilitar funcionalidades sem redeploy.
- **Rate limiting / Retry** ✅
  - Limitar requisições por usuário.
  - Retry automático em falhas temporárias.
- **Monitoramento simples** ✅
  - Métricas básicas, logs, healthcheck.
- **RBAC (Role-Based Access Control)** ✅
  - Controle de acesso baseado em função (admin, usuário normal, etc).

## Criar migration

    npm run typeorm migration:create src/infrastructure/typeorm/migrations/table-name

## Executar a migration

    npm run typeorm migration:run -- -d dist/infrastructure/typeorm/database.providers.js

## Run docker-compose

    docker-compose -f docker-compose.local.yml up --build

# Docker

#### Cria a imagem

    docekr compose build

#### Roda os containers

    docker compose up -d

#### Ver IP do container

    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' CONTAINER_ID
