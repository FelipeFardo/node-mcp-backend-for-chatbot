import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "@/db/connection.ts";
import { auth } from "../middlewares/auth.ts";
import { BadRequestError } from "./_errors/bad-request-error.ts";

export async function getProfile(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/me",
			{
				schema: {
					summary: "👤 Perfil do Usuário Autenticado",
					description: `
**Obtém Informações do Usuário Logado**

Retorna os dados do usuário atual baseado no token JWT fornecido.

**Autenticação:**
- Header obrigatório: \`Authorization: Bearer <JWT_TOKEN>\`
- Token deve ser obtido via POST /auth

**Retorno:**
- Dados básicos do usuário autenticado
- ID único para identificação
- Primeiro nome para personalização

**Casos de uso:**
- Exibir informações do usuário em interfaces
- Validar identidade para operações sensíveis
- Personalizar experiência do chatbot
					`.trim(),
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					response: {
						200: z
							.object({
								user: z
									.object({
										id: z.string().describe("ID único do usuário no sistema"),
										firstName: z.string().describe("Primeiro nome do usuário"),
										fullName: z.string().describe("Nome completo do usuário"),
										phone: z
											.string()
											.nullable()
											.describe("Telefone cadastrado do usuário"),
										createdAt: z.string().describe("Data de criação da conta"),
									})
									.describe("Dados completos do usuário"),
							})
							.describe("Perfil do usuário obtido com sucesso"),
						401: z
							.object({
								error: z.string().describe("Tipo do erro"),
								message: z.string().describe("Descrição do erro"),
								statusCode: z.number().describe("Código HTTP do erro"),
							})
							.describe("Token JWT inválido ou ausente"),
						404: z
							.object({
								error: z.string().describe("Tipo do erro"),
								message: z.string().describe("Descrição do erro"),
								statusCode: z.number().describe("Código HTTP do erro"),
							})
							.describe("Usuário não encontrado"),
					},
				},
			},
			async (request) => {
				const sub = await request.getCurrentUserId();

				const userById = await db.query.users.findFirst({
					where(fields) {
						return eq(fields.id, sub);
					},
				});

				if (!userById) {
					throw new BadRequestError();
				}
				const user = {
					id: userById.id,
					firstName: userById.name.split(" ")[0],
					fullName: userById.name,
					phone: userById.phone,
					createdAt:
						userById.createdAt?.toISOString() || new Date().toISOString(),
				};

				return { user };
			},
		);
}
