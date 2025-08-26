<div align="center">

# Node MCP Chatbot API

**API RESTful para chatbot de renegociação de dívidas com suporte ao Model Context Protocol (MCP)**

Uma aplicação completa construída com Fastify, JWT, PostgreSQL e integração MCP para fornecer dados estruturados de usuários e dívidas para sistemas de chatbot.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

[🚀 Demo](https://node-api-mcp-chatbot.onrender.com/docs) • [📚 Documentação](#-documentação-da-api) • [🔧 Instalação](#️-setup-e-configuração)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#️-arquitetura)
- [Setup e Configuração](#️-setup-e-configuração)
- [Documentação da API](#-documentação-da-api)
- [Model Context Protocol (MCP)](#-model-context-protocol-mcp)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#️-estrutura-do-projeto)

---

## 🎯 Sobre o Projeto

Este projeto implementa um **servidor MCP (Model Context Protocol)** que expõe uma API RESTful para chatbots de renegociação de dívidas. A aplicação fornece:

- **Autenticação segura** com JWT e API Key
- **Consulta de usuários** e suas informações pessoais
- **Gestão de dívidas** com status e histórico
- **Integração MCP** para chatbots e assistentes IA
- **Documentação interativa** com Swagger UI e Scalar

### 🎯 Casos de Uso

- Chatbots de atendimento ao cliente para renegociação de dívidas
- Sistemas de cobrança automatizada
- Assistentes virtuais com acesso a dados financeiros
- Integração com plataformas de IA conversacional

## 🚀 Tecnologias

### Core
- **[Node.js 18+](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Tipagem estática
- **[Fastify](https://fastify.dev/)** - Framework web de alta performance

### Database & ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe com migrations
- **[Docker Compose](https://docs.docker.com/compose/)** - Containerização do banco

### Validação & Documentação
- **[Zod](https://zod.dev/)** - Validação de schemas e variáveis de ambiente
- **[Swagger/OpenAPI](https://swagger.io/)** - Especificação da API
- **[Scalar API Reference](https://scalar.com/)** - Interface moderna de documentação

### MCP & Autenticação
- **[@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)** - SDK oficial do MCP
- **[fastify-mcp-server](https://npmjs.com/package/fastify-mcp-server)** - Plugin Fastify para MCP
- **[JSON Web Token](https://jwt.io/)** - Autenticação stateless

### Desenvolvimento
- **[Biome](https://biomejs.dev/)** - Linter e formatter ultra-rápido
- **[TSX](https://tsx.is/)** - Executor TypeScript para desenvolvimento
- **[TSup](https://tsup.egoist.dev/)** - Bundler para produção

## 🏗️ Arquitetura

### Estrutura em Camadas

```mermaid
graph TB
    A[Cliente/Chatbot] --> B[Fastify HTTP Server]
    B --> C[Middlewares]
    C --> D[Authentication Layer]
    D --> E[API Routes]
    D --> F[MCP Endpoint]
    E --> G[Business Logic]
    F --> H[MCP Tools & Resources]
    G --> I[Drizzle ORM]
    H --> I
    I --> J[PostgreSQL Database]
```

### Componentes Principais

- **🌐 HTTP Layer**: Rotas RESTful com validação Zod e documentação OpenAPI
- **🔐 Authentication**: JWT Bearer tokens e API Key para diferentes níveis de acesso
- **🤖 MCP Integration**: Tools e resources para consulta de dados via chatbots
- **🗄️ Data Layer**: Drizzle ORM com migrations e type-safety
- **📊 Monitoring**: Health checks e error handling estruturado

## ⚙️ Setup e Configuração

### 📋 Pré-requisitos

- **Node.js 18+** (recomendado 20+) - [Download](https://nodejs.org/)
- **npm 9+** ou **yarn** - Gerenciador de pacotes
- **Docker & Docker Compose** - [Instalar Docker](https://docs.docker.com/get-docker/)
- **Git** - Para clonagem do repositório

### 🚀 Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot.git
cd Node-Api-Mcp-Chatbot

# 2. Instale as dependências
npm install

# 3. Configure o banco de dados
docker compose up -d

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 5. Execute as migrações e popule o banco
npm run db:migrate
npm run db:seed

# 6. Inicie o servidor
npm run dev
```

### 🔧 Configuração Detalhada

#### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3333

# Banco de dados PostgreSQL
DATABASE_URL=postgresql://docker:docker@localhost:5433/chatbot

# Autenticação
JWT_SECRET=sua_chave_jwt_super_segura_aqui_128_bits_minimo
APIKEY=sua_chave_de_api_para_rotas_protegidas

# Opcional: Configurações de ambiente
NODE_ENV=development
```

> ⚠️ **Importante**: Use chaves fortes em produção. O `JWT_SECRET` deve ter pelo menos 32 caracteres.

#### 2. Banco de Dados

O projeto usa PostgreSQL com Docker. Configuração no `docker-compose.yaml`:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: chatbot
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

#### 3. Execução

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | 🔄 Desenvolvimento com hot reload |
| `npm start` | 🚀 Produção (requer build) |
| `npm run build` | 📦 Build para produção |
| `npm run mcp` | 🔍 Abre o MCP Inspector |

**Servidor padrão**: http://localhost:3333

**Documentação**: http://localhost:3333/docs

## � Exemplos de Uso

### 🔐 Fluxo de Autenticação Completo

#### 1. Obter Token JWT

```bash
curl -X POST http://localhost:3333/auth \
  -H "apiKey: sua_chave_de_api_aqui" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "5555123456789"}'
```

**Resposta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTY0MTA4MTYwMH0.signature"
}
```

#### 2. Consultar Perfil do Usuário

```bash
curl -X GET http://localhost:3333/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 🤖 Exemplos MCP

#### Buscar Usuários Ativos

```bash
curl -X POST http://localhost:3333/mcp \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_users",
      "arguments": {
        "status": "active"
      }
    }
  }'
```

#### Consultar Dívidas do Usuário

```bash
curl -X POST http://localhost:3333/mcp \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/read",
    "params": {
      "uri": "debts://me"
    }
  }'
```

### 🌐 Uso com JavaScript/TypeScript

#### 👤 Endpoints de Usuário

##### GET `/me` - Perfil do Usuário

Retorna informações do usuário autenticado.

**Headers**:
```http
Authorization: Bearer <JWT_TOKEN>
```

**Resposta**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João da Silva",
  "email": "joao@exemplo.com",
  "phone": "5555123456789",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 🤖 Endpoint MCP

##### POST `/mcp` - Ferramentas do Model Context Protocol

Executa tools e resources MCP para consulta de dados.

**Headers**:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Formato da Requisição**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_users",
    "arguments": {
      "status": "active"
    }
  }
}
```

**Ferramentas Disponíveis**:

| Tool | Descrição | Parâmetros |
|------|-----------|------------|
| `search_users` | Lista usuários por status | `{ status: "active" \| "inactive" }` |
| `search_user_info` | Dados do usuário autenticado | `{}` |

**Resources Disponíveis**:

| Resource | Descrição | Parâmetros |
|----------|-----------|------------|
| `debts://me` | Dívidas do usuário autenticado | `{}` |

#### 📊 Health Check

##### GET `/health` - Status do Servidor

```http
GET /health
```

**Resposta**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### ❌ Códigos de Erro

| Código | Descrição | Exemplo |
|--------|-----------|---------|
| `400` | Bad Request | Dados inválidos ou malformados |
| `401` | Unauthorized | Token JWT inválido ou ausente |
| `403` | Forbidden | API Key inválida |
| `404` | Not Found | Recurso não encontrado |
| `500` | Internal Server Error | Erro interno do servidor |

**Formato de Erro**:
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials.",
  "statusCode": 401
}
```



## � Model Context Protocol (MCP)

### 🎯 O que é MCP?

O **Model Context Protocol (MCP)** é um protocolo que permite que assistentes de IA e chatbots acessem dados e funcionalidades de forma estruturada e segura. Este projeto implementa um servidor MCP que expõe ferramentas para consulta de usuários e dívidas.

### 🛠️ Tools Disponíveis

#### 1. `search_users` - Busca de Usuários

Permite buscar usuários por status no sistema.

**Parâmetros**:
```typescript
{
  status: "active" | "inactive"
}
```

**Exemplo de Uso**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_users",
    "arguments": {
      "status": "active"
    }
  }
}
```

**Resposta**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "[{\"id\":\"123e4567-e89b-12d3-a456-426614174000\",\"name\":\"João Silva\",\"email\":\"joao@exemplo.com\",\"phone\":\"5555123456789\",\"status\":\"active\"}]"
    }
  ]
}
```

#### 2. `search_user_info` - Informações do Usuário Autenticado

Retorna dados detalhados do usuário que fez a requisição.

**Parâmetros**: Nenhum (usa o JWT para identificar o usuário)

**Exemplo de Uso**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_user_info",
    "arguments": {}
  }
}
```

### � Resources Disponíveis

#### 1. `debts://me` - Dívidas do Usuário

Retorna todas as dívidas associadas ao usuário autenticado.

**URI**: `debts://me`

**Exemplo de Resource**:
```json
{
  "method": "resources/read",
  "params": {
    "uri": "debts://me"
  }
}
```

**Resposta**:
```json
{
  "contents": [
    {
      "uri": "debts://me/123e4567-e89b-12d3-a456-426614174001",
      "text": "{\"id\":\"123e4567-e89b-12d3-a456-426614174001\",\"userId\":\"123e4567-e89b-12d3-a456-426614174000\",\"description\":\"Financiamento do veículo\",\"amount\":\"15000.00\",\"dueDate\":\"2024-12-31T23:59:59Z\",\"status\":\"pending\"}"
    }
  ]
}
```

### 🔧 Testando com MCP Inspector

O **MCP Inspector** é uma ferramenta visual para testar servers MCP.

#### Instalação e Uso

```bash
# 1. Abrir o MCP Inspector
npm run mcp

# 2. Conectar ao servidor
# URL: http://localhost:3333/mcp
# Headers: Authorization: Bearer <seu_jwt_token>
```

#### Configuração no Inspector

1. **Server URL**: `http://localhost:3333/mcp`
2. **Headers**:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **Method**: POST

#### Exemplos de Teste

**Buscar usuários ativos**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_users",
    "arguments": {
      "status": "active"
    }
  }
}
```

**Consultar dívidas**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "debts://me"
  }
}
```

### 🔒 Segurança MCP

- **Autenticação obrigatória**: Todas as tools e resources requerem JWT válido
- **Isolamento de dados**: Cada usuário só acessa seus próprios dados
- **Validação de entrada**: Todos os parâmetros são validados com Zod
- **Rate limiting**: Implementado no nível do Fastify (configurável)

## 🗂️ Estrutura do Projeto

```
.
├── docker-compose.yaml
├── drizzle.config.ts
├── package.json
├── tsconfig.json / tsup.config.ts
├── src/
│   ├── env.ts
│   ├── db/
│   │   ├── connection.ts
│   │   ├── seed.ts
│   │   └── schema/
│   ├── http/
│   │   ├── server.ts
│   │   ├── middlewares/
│   │   └── routes/
│   └── mcp/
└── db/migrations/
```

## 📘 OpenAPI/Swagger e exemplos práticos

Documentação interativa: acesse `GET /docs` (Scalar UI sobre o Swagger) para visualizar e testar os endpoints. Ambientes configurados:

- Produção: `https://node-api-mcp-chatbot.onrender.com`
- Desenvolvimento: `http://localhost:3333`

Autenticação:

- Em `/auth` use o header `apiKey: <APIKEY>` e informe `phoneNumber` para receber um JWT.
- Para rotas protegidas (`/me` e `/mcp`), envie `Authorization: Bearer <JWT>`.
