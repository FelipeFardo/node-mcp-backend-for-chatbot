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
					summary: "Retorna o perfil do usuário autenticado",
					description:
						"Requer um token JWT válido no header Authorization (Bearer).",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					response: {
						200: z.object({
							user: z.object({
								id: z.string(),
								firstName: z.string(),
							}),
						}),
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
				};

				return { user };
			},
		);
}
