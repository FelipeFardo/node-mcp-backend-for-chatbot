import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "@/db/connection.ts";
import { jwtSign } from "../../mcp/auth.ts";
import { chatbotAuth } from "../middlewares/chatbot-auth.ts";
import { BadRequestError } from "./_errors/bad-request-error.ts";

export async function authenticate(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(chatbotAuth)
		.post(
			"/auth",
			{
				schema: {
					summary: "🔐 Autenticação por Telefone + API Key",
					description: `
**Autenticação do Sistema de Chatbot**

Este endpoint autentica usuários através do número de telefone e retorna um token JWT.

**Processo:**
1. Envie API Key no header \`apiKey\`
2. Forneça o número de telefone no body
3. Receba um token JWT válido
4. Use o JWT em todas as outras rotas protegidas

**Segurança:**
- API Key obrigatória para acesso
- Telefone deve estar cadastrado no sistema
- JWT expira conforme configuração do servidor

**Exemplo de uso:**
\`\`\`
Headers: { "apiKey": "sua-api-key-aqui" }
Body: { "phoneNumber": "+5511999999999" }
\`\`\`
					`.trim(),
					tags: ["Auth"],
					security: [{ apiKey: [] }],
					body: z
						.object({
							phoneNumber: z
								.string()
								.min(10, "Telefone deve ter pelo menos 10 dígitos")
								.max(15, "Telefone deve ter no máximo 15 dígitos")
								.describe(
									"Número de telefone do usuário (com ou sem código do país)",
								),
						})
						.describe("Dados para autenticação"),
					response: {
						201: z
							.object({
								token: z
									.string()
									.describe(
										"Token JWT para autenticação nas próximas requisições",
									),
								user: z
									.object({
										id: z.string().describe("ID único do usuário"),
										name: z.string().describe("Nome completo do usuário"),
										phone: z
											.string()
											.nullable()
											.describe("Telefone utilizado na autenticação"),
									})
									.describe("Dados básicos do usuário autenticado"),
							})
							.describe("Autenticação realizada com sucesso"),
						400: z
							.object({
								message: z.string().describe("Descrição do erro"),
							})
							.describe("Erro de validação ou credenciais inválidas"),
						401: z
							.object({
								message: z.string().describe("Descrição do erro"),
							})
							.describe("API Key inválida ou ausente"),
					},
				},
			},
			async (request) => {
				const { phoneNumber } = request.body;
				console.log(phoneNumber);
				const user = await db.query.users.findFirst({
					where(fields, { eq }) {
						return eq(fields.phone, phoneNumber);
					},
				});

				console.log(user);

				if (!user) {
					throw new BadRequestError("Invalid credentials.");
				}

				const token = jwtSign(user.id);

				return {
					token,
					user: {
						id: user.id,
						name: user.name,
						phone: user.phone,
					},
				};
			},
		);
}
