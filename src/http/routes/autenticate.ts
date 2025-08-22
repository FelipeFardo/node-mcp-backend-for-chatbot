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
					summary: "Autenticação por telefone",
					description:
						"Recebe o número de telefone do usuário e retorna um JWT para autenticação nas demais rotas.",
					tags: ["Auth"],
					security: [{ apiKey: [] }],
					body: z.object({
						phoneNumber: z.string(),
					}),
					response: {
						201: z.object({
							token: z.string(),
						}),
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
				};
			},
		);
}
