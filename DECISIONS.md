# DECISIONS.md

Este documento registra decisões importantes tomadas durante o desenvolvimento do projeto.

## 1. Banco de Dados

- **Decisão:** Utilizar PostgreSQL com extensão `pgvector` para suportar embeddings e operações de similaridade.
- **Justificativa:** PostgreSQL é robusto, escalável e `pgvector` facilita integração com IA.
- **Status:** Aprovado ✅

## 2. Cache e Feature Flags

- **Decisão:** Utilizar Redis como cache de prompts/respostas da IA e controle de feature flags.
- **Justificativa:** Redis é leve, rápido e já conhecido no mercado.
- **Alternativas Consideradas:** Memcached, armazenamento em memória local.
- **Status:** Aprovado ✅

## 3. Autenticação

- **Decisão:** JWT para autenticação e autorização.
- **Justificativa:** Simples de implementar e já consolidado em aplicações distribuídas.
- **Status:** Aprovado ✅

## 4. Organização da Arquitetura

- **Decisão:** Utilizar NestJS com injeção de dependência e camadas com clean architecture.
- **Justificativa:** Facilita testes, manutenção e separação de responsabilidades.
- **Status:** Aprovado ✅

## 5. Cobertura de Testes

- **Decisão:** Garantir cobertura mínima de 85%, mirando 100% para classes críticas (auth, ai, cache).
- **Justificativa:** Evitar regressões e aumentar confiabilidade do sistema.
- **Status:** Aprovado ✅

## 6. Deploy

- **Decisão:** Docker Compose `api`, `db` e `redis`.
- **Justificativa:** Facilitar setup do ambiente de desenvolvimento.
- **Status:** Aprovado ✅
