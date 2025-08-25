import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function health(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/health",
		{
			schema: {
				summary: "🩺 Health Check do Sistema",
				description: `
**Verificação de Saúde do Servidor**

Endpoint simples para verificar se o servidor está funcionando corretamente.

**Uso típico:**
- Monitoramento de infraestrutura
- Load balancers
- Health checks automáticos
- Verificação rápida de disponibilidade

**Retorna:** Status "OK" se o servidor estiver funcionando.
				`.trim(),
				tags: ["Health"],
				response: {
					200: z
						.object({
							status: z.string().describe("Status do servidor"),
							timestamp: z.string().describe("Timestamp da verificação"),
							uptime: z.number().describe("Tempo de atividade em segundos"),
						})
						.describe("Resposta de health check bem-sucedida"),
				},
			},
		},
		() => {
			return {
				status: "OK",
				timestamp: new Date().toISOString(),
				uptime: process.uptime(),
			};
		},
	);
}
