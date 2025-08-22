import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/connection.ts";

const mcpserver = new McpServer({
	name: "demo-server",
	version: "1.0.0",
});

mcpserver.registerTool(
	"search_users",
	{
		title: "Busca usuários",
		description: "Busca informações dos usuários",
		inputSchema: {
			status: z.enum(["active", "inactive"]),
		},
	},
	async ({ status }) => {
		const users = await db.query.users.findMany({
			where(fields) {
				return eq(fields.status, status);
			},
		});
		return {
			content: [{ type: "text", text: JSON.stringify(users) }],
		};
	},
);

mcpserver.registerTool(
	"search_user_info",
	{
		title: "Busca informações do usuário autenticado",
	},
	async ({ authInfo }) => {
		const user = await db.query.users.findFirst({
			where(fields) {
				return eq(fields.id, authInfo.clientId);
			},
		});
		return {
			content: [{ type: "text", text: JSON.stringify(user) }],
		};
	},
);

mcpserver.registerTool(
	"search_debts",
	{
		title: "Busca dívidas do usuário",
		description: `
			Você deve usar esta tool quando o usuário pedir para consultar as dívidas de uma pessoa.
			Ela retorna uma lista de dívidas registradas no sistema.
			Se não houver dívidas, retorna uma lista vazia.`,
	},
	async ({ authInfo }) => {
		const debts = await db.query.debts.findFirst({
			where(fields) {
				return eq(fields.userId, authInfo.clientId);
			},
		});
		return {
			content: [{ type: "text", text: JSON.stringify(debts) }],
		};
	},
);

export { mcpserver };
