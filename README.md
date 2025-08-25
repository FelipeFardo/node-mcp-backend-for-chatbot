<div align="center">

# Node MCP Chatbot API

Projeto com Fastify, JWT, Swagger/Scalar, Drizzle ORM (PostgreSQL) e Model Context Protocol (MCP) para demonstrar um chatbot de renegociação com dados oficiais de usuários e dívidas.

</div>

## 🚀 Tecnologias

- Node.js + TypeScript
- Fastify (CORS, JWT)
- PostgreSQL (Docker Compose)
- Drizzle ORM (migrations e schema type-safe)
- Zod (validação de ambiente e schemas)
- Swagger + Scalar API Reference
- MCP (Model Context Protocol) via `@modelcontextprotocol/sdk` e `fastify-mcp-server`
- Biome (lint/format)

## 🏗️ Arquitetura

- Separação por camadas: HTTP (rotas/middlewares), MCP (tools), DB (schema/conn).
- Validação forte de entrada/saída com Zod e OpenAPI.
- Autenticação com JWT (Bearer) e API Key para endpoints específicos.
- Ferramentas MCP expostas em `/mcp` para consulta de usuários e dívidas.

## ⚙️ Setup e Configuração

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+
- Docker e Docker Compose

### 1. Clone o repositório
```sh
git clone https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot.git
cd Node-Api-Mcp-Chatbot
```

### 2. Suba o banco de dados
```sh
docker compose up -d
```

### 3. Configure as variáveis de ambiente (.env)
```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5433/chatbot
JWT_SECRET=uma_chave_segura_aqui
APIKEY=sua_chave_de_api_para_rotas_protegidas
```

### 4. Instale as dependências
```sh
npm install
```

### 5. Migre o banco e (opcional) rode o seed
```sh
npm run db:migrate
npm run db:seed
```

### 6. Execute o projeto

Desenvolvimento:
```sh
npm run dev
```

Produção:
```sh
npm start
```

Servidor padrão: http://localhost:3333

## 📚 Scripts Disponíveis

- `npm run dev` — Desenvolvimento com reload
- `npm start` — Produção (build prévio necessário se mudar código)
- `npm run build` — Build via tsup
- `npm run mcp` — Abre o MCP Inspector
- `npm run db:migrate` — Executa migrações do Drizzle
- `npm run db:studio` — UI do Drizzle Kit
- `npm run db:migrate:deploy` — Migrações sem dotenv-cli
- `npm run db:generate` — Gera migrações a partir do schema
- `npm run db:seed` — Popula o banco com dados de exemplo

## 🌐 Endpoints

Base URL: `http://localhost:3333`

- `GET /health` — Health check
- `POST /auth` — Autenticação por telefone
  - Header: `apiKey: <sua APIKEY>`
  - Body: `{ "phoneNumber": "5555123456789" }`
  - Resposta: `{ "token": "<JWT>" }`
- `GET /me` — Perfil do usuário autenticado
  - Header: `Authorization: Bearer <JWT>`
- `POST /mcp` — Endpoint do servidor MCP (usar o mesmo JWT como Bearer)
- `GET /docs` — Documentação (Swagger + Scalar)



## 🧭 MCP Tools

- `search_users` — Lista usuários por `status` (`active` | `inactive`).
- `search_user_info` — Retorna dados do usuário autenticado.

## 🗄️ MCP Resources

- `debts://me` — Retorna dívidas do usuário autenticado.

### Sobre o endpoint `/mcp`

O endpoint `/mcp` expõe as ferramentas (tools) e recursos (resources) do servidor MCP. Ele aceita requisições POST, normalmente com JWT válido no header `Authorization`. O payload segue o padrão do Model Context Protocol, permitindo que clientes (como o MCP Inspector ou bots) consultem e executem as tools/resources registradas no backend.

Exemplo de uso: buscar usuários, consultar informações do usuário autenticado ou listar dívidas do usuário.

Use `npm run mcp` para abrir o inspector e conectar em `http://localhost:3333/mcp` com `Authorization: Bearer <JWT>`.

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
