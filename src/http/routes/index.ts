import type { FastifyInstance } from "fastify";
import { authenticate } from "./autenticate.ts";
import { getProfile } from "./get-profile.ts";
import { health } from "./health.ts";

export async function registerRoutes(app: FastifyInstance) {
	await app.register(health);
	await app.register(authenticate);
	await app.register(getProfile);
}
