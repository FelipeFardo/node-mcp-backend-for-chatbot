import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import scalarDocs from "@scalar/fastify-api-reference";
import FastifyMcpServer from "fastify-mcp-server";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "../env.ts";
import { myVerifier } from "../mcp/auth.ts";
import { mcpserver } from "../mcp/mcp-server.ts";
import { swaggerConfig } from "./swagger.ts";

export async function registerPlugins(app: FastifyInstance) {
	// CORS
	await app.register(fastifyCors, {
		origin: "*",
	});

	// MCP Server
	await app.register(FastifyMcpServer, {
		server: mcpserver.server,
		endpoint: "/mcp",
		bearerMiddlewareOptions: {
			verifier: myVerifier,
		},
	});

	// Zod Type Provider
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// Swagger
	await app.register(fastifySwagger, swaggerConfig as any);

	// Scalar Docs
	await app.register(scalarDocs, {
		routePrefix: "/docs",
	});

	// JWT
	app.register(fastifyJwt, {
		secret: env.JWT_SECRET,
	});
}
