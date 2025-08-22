import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import scalarDocs from "@scalar/fastify-api-reference";
import fastify from "fastify";
import FastifyMcpServer from "fastify-mcp-server";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "../env.ts";
import { myVerifier } from "../mcp/auth.ts";
import { mcpserver } from "../mcp/mcp-server.ts";
import { errorHandler } from "./error-handler.ts";
import { authenticate } from "./routes/autenticate.ts";
import { getProfile } from "./routes/get-profile.ts";
import { health } from "./routes/health.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

await app.register(fastifyCors, {
	origin: "*",
});

await app.register(FastifyMcpServer, {
	server: mcpserver.server,
	endpoint: "/mcp",
	bearerMiddlewareOptions: {
		verifier: myVerifier,
	},
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

await app.register(fastifySwagger, {
	openapi: {
		paths: {
			"/mcp": {
				post: {
					tags: ["MCP"],
					summary: "Executa ferramentas MCP",
					description:
						"Endpoint para executar tools MCP como search_users, search_user_info, search_debts.",
					security: [{ bearerAuth: [] }],
					requestBody: {
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										tool: {
											type: "string",
											enum: [
												"search_users",
												"search_user_info",
												"search_debts",
											],
										},
										input: { type: "object" },
									},
									required: ["tool", "input"],
								},
							},
						},
					},
					responses: {
						200: {
							description: "Resultado da execução da tool MCP",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											content: { type: "array", items: { type: "object" } },
										},
									},
								},
							},
						},
					},
				},
			},
		},
		info: {
			title: "Node MCP Chatbot API",
			description:
				"API de exemplo para um chatbot de renegociação, construída com Fastify, JWT, Drizzle ORM (PostgreSQL), Zod e Model Context Protocol (MCP). Inclui autenticação por JWT, API Key para rotas protegidas e documentação com Swagger/Scalar.",
			version: "1.0.0",
			contact: {
				name: "Felipe Fardo",
				url: "https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot",
			},
			license: {
				name: "MIT",
				url: "https://opensource.org/licenses/MIT",
			},
		},
		externalDocs: {
			description: "Leia o README do projeto",
			url: "https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot",
		},
		servers: [
			{
				url: `https://node-api-mcp-chatbot.onrender.com`,
				description: "Produção",
			},
		],
		tags: [
			{ name: "Health", description: "Health check e monitoramento" },
			{ name: "Auth", description: "Autenticação e emissão de tokens" },
			{ name: "Users", description: "Recursos de usuário/autorização" },
			{ name: "MCP", description: "Ferramentas MCP expostas via /mcp" },
		],
		security: [{ bearerAuth: [] }],
		components: {
			securitySchemes: {
				apiKey: {
					type: "apiKey",
					name: "apiKey",
					in: "header",
					description:
						"Chave de API necessária para autenticar a rota /auth e outras rotas que exigem API Key.",
				},
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description:
						"Token JWT no formato Bearer para acessar rotas autenticadas. Obtenha o token em /auth.",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

await app.register(scalarDocs, {
	routePrefix: "/docs",
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(authenticate);
app.register(getProfile);
app.register(health);
app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log("Running in port", env.PORT);
});
