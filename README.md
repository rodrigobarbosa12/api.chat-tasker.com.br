# Chat Task Manager

Chat Task Manager é um sistema de organização inteligente que utiliza **Inteligência Artificial** para estruturar tarefas, gerenciar informações e otimizar fluxos de trabalho.
O objetivo do projeto é transformar entradas desorganizadas (como mensagens ou anotações livres) em dados estruturados, prontos para análise e execução.

---

## 🔗 URLs Importantes

Para facilitar o acesso a métricas, documentação e deploy, seguem as URLs principais do projeto **Chat Task Manager**:

- **Métricas:** [https://api.nimblefast.com.br/metrics](https://api.nimblefast.com.br/metrics)
- **Documentação do Swagger:** [https://api.nimblefast.com.br/docs](https://api.nimblefast.com.br/docs)
- **Coverage do teste unitário:** [https://api.nimblefast.com.br/coverage](https://api.nimblefast.com.br/coverage)
- **URL do deploy/CI:** [https://github.com/rodrigobarbosa12/api.chat-tasker.com.br/actions](https://github.com/rodrigobarbosa12/api.chat-tasker.com.br/actions)

---

## 🚀 Tecnologias Utilizadas

- **Node.js / NestJS** → Framework backend para APIs escaláveis.
- **TypeScript** → Tipagem estática para maior confiabilidade do código.
- **PostgreSQL + pgvector** → Banco relacional com suporte a vetores para IA.
- **Redis** → Cache para otimizar desempenho e reduzir chamadas redundantes.
- **Docker & Docker Compose** → Conteinerização e orquestração de serviços.
- **IA / NLP** → Estratégias de processamento de linguagem natural para:
  - Resumir e organizar informações.
  - Gerar títulos e descrições automáticas.
  - Classificar dados de entrada.

---

## 📂 Estrutura de Decisões

As principais decisões de arquitetura e estratégia estão documentadas em **DECISIONS.md**, garantindo rastreabilidade e clareza ao longo da evolução do projeto.

---

## 🤖 Estratégias de IA

1. **Extração de dados**: o sistema identifica informações relevantes em textos não estruturados.
2. **Classificação**: categorização automática em tarefas, lembretes ou insights.
3. **Geração**: criação de descrições curtas e títulos automáticos.
4. **Otimização**: cache inteligente em Redis para evitar repetições desnecessárias de processamento de IA.

---

## 🐳 Execução com Docker

1. Clone o repositório:

   ```bash
   git clone https://github.com/rodrigobarbosa12/api.chat-tasker.com.br.git
   cd api.chat-tasker.com.br
   ```

2. Inicie os containers:

   ```bash
   docker compose up -d
   ```

3. Acesse a API em:
   [http://localhost:4006](http://localhost:4006)

---

## 📌 Objetivo

Criar uma base sólida de **organização assistida por IA**, facilitando o gerenciamento de informações no dia a dia de empresas e usuários.

## Checklist Completo do Projeto

### 1️⃣ Requisitos Funcionais

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

### 2️⃣ Requisitos Não Funcionais

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

### 3️⃣ IA — Especificações mínimas

- **Smartização** ✅
  - Resumir texto livre em título/descrição curta.
- **Busca semântica** ✅
  - Embeddings para busca de tarefas relacionadas.
  - Cache simples de prompts/respostas (opcional).
- **Priorização** ✅
  - Sugestão de urgência/impacto com explicação curta.
- **Documentação do setup**
  - Explicar uso local ou via APIs externas (ex.: OpenAI).

### 4️⃣ Bônus (Opcional)

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
