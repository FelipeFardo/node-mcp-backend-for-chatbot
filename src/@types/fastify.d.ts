import "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		checkApiKey(): void;
		getCurrentUserId(): Promise<string>;
	}
}
