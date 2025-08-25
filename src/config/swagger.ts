import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { env } from "../env.ts";
import { mcpOpenApiPaths } from "./mcp-docs.ts";

export const swaggerConfig = {
	swagger: {
		info: {
			title: "Node MCP Chatbot API",
			description: `
**🤖 API RESTful para Chatbot de Renegociação**

API completa construída com Fastify, JWT, PostgreSQL e integração MCP para chatbots de renegociação de dívidas.

**🚀 Recursos Principais:**

• Autenticação segura com JWT e API Key
• Integração Model Context Protocol (MCP)  
• Gestão de usuários e dívidas
• Documentação interativa com Swagger
• Performance otimizada com TypeScript

**🔗 Links Úteis:**

• Repositório: https://github.com/FelipeFardo/Node-MCP-Backend-for-Chatbot
• Documentação: /docs
• MCP Inspector: Execute 'npm run mcp'

**⚡ Início Rápido:**

1. Use POST /auth com API Key para obter JWT
2. Use GET /me com JWT Bearer para dados do usuário  
3. Use POST /mcp para ferramentas MCP

**💡 Dica:** Teste todos os endpoints nesta interface usando "Try it out"
			`,
			version: "1.0.0",
			contact: {
				name: "Felipe Fardo",
				url: "https://github.com/FelipeFardo/Node-MCP-Backend-for-Chatbot",
				email: "felipe.fardo@exemplo.com",
			},
			license: {
				name: "MIT License",
				url: "https://opensource.org/licenses/MIT",
			},
		},
		externalDocs: {
			description: "Leia o README do projeto",
			url: "https://github.com/FelipeFardo/Node-MCP-Backend-for-Chatbot",
		},
		servers: [
			{
				url: "https://node-api-mcp-chatbot.onrender.com",
				description: "Produção",
			},
			{
				url: `http://localhost:${env.PORT}`,
				description: "Desenvolvimento",
			},
		],
		tags: [
			{
				name: "Health",
				description: "🩺 Health check e monitoramento do sistema",
			},
			{ name: "Auth", description: "🔐 Autenticação e geração de tokens JWT" },
			{ name: "Users", description: "👤 Recursos de usuário e perfil" },
			{
				name: "MCP",
				description:
					"🤖 Model Context Protocol - Tools e Resources para chatbots",
			},
		],
		paths: {
			...mcpOpenApiPaths,
		},
		securityDefinitions: {
			apiKey: {
				type: "apiKey",
				name: "apiKey",
				in: "header",
				description: "Chave de API para autenticação no endpoint /auth",
			},
			bearerAuth: {
				type: "apiKey",
				name: "Authorization",
				in: "header",
				description:
					"Token JWT para acessar endpoints protegidos (formato: Bearer <token>)",
			},
		},
	},
	transform: jsonSchemaTransform,
};
