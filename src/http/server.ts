import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "../env.ts";
import { registerPlugins } from "../config/plugins.ts";
import { registerRoutes } from "./routes/index.ts";
import { errorHandler } from "./error-handler.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

// Error handler
app.setErrorHandler(errorHandler);

// Plugins (CORS, JWT, Swagger, MCP, etc.)
await registerPlugins(app);

// Routes
await registerRoutes(app);

// Start server
app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log("🚀 Server running on port", env.PORT);
	console.log("� API Documentation: http://localhost:3333/docs");
	console.log("� MCP Endpoint: http://localhost:3333/mcp");
});

export { app };
