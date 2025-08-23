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
						"Este endpoint permite a execução de ferramentas MCP, como <b>search_users</b>, <b>search_user_info</b> e <b>search_debts</b>, para consulta e análise de dados de usuários e dívidas.<br><br>" +
						"Utilize este endpoint para integrar funcionalidades MCP ao seu fluxo de chatbot, automatizando buscas e retornos de informações relevantes.<br><br>" +
						"<ul>" +
						"<li>O MCP Inspector recomenda validar cuidadosamente os parâmetros enviados em <b>tool</b> e <b>input</b>, garantindo que estejam de acordo com o esperado por cada ferramenta.</li>" +
						"<li>Em caso de dúvidas sobre o formato dos dados ou sobre o funcionamento das ferramentas MCP, consulte a documentação oficial ou utilize o MCP Inspector para simular requisições e analisar respostas.</li>" +
						"<li>Para acessar as ferramentas, é obrigatório enviar o token JWT no formato Bearer no cabeçalho <b>Authorization</b> (bearerAuth).</li>" +
						"</ul>",
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
											description: "Nome da ferramenta MCP a ser executada.",
										},
										input: {
											type: "object",
											description:
												"Parâmetros específicos exigidos pela ferramenta selecionada.",
										},
									},
									required: ["tool", "input"],
								},
							},
						},
					},
					responses: {
						200: {
							description:
								"Resultado da execução da ferramenta MCP, retornando um array de objetos com os dados solicitados.",
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
				url: "https://github.com/FelipeFardo/Node-MCP-Backend-for-Chatbot",
			},
			license: {
				name: "MIT",
				url: "https://opensource.org/licenses/MIT",
			},
		},
		externalDocs: {
			description: "Leia o README do projeto",
			url: "https://github.com/FelipeFardo/Node-MCP-Backend-for-Chatbot",
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
