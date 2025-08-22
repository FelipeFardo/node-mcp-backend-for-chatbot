import type { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import { env } from "@/env.ts";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error.ts";

export const chatbotAuth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request) => {
		const apiKey = request.headers.apikey;

		if (apiKey !== env.APIKEY) {
			throw new UnauthorizedError("Invalid auth token");
		}
	});
});
