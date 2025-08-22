import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function health(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/health",
		{
			schema: {
				summary: "Health check",
				description:
					"Endpoint simples para verificar se o servidor está de pé.",
				tags: ["Health"],
				response: {
					200: z.string(),
				},
			},
		},
		() => {
			return "OK";
		},
	);
}
