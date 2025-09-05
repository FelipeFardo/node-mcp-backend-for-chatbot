import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/connection.ts";

const mcpserver = new McpServer({
	name: "Chatbot-mcp",
	version: "1.0.0",
	title: "Chatbot MCP",
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
		console.log(authInfo.clientId);
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

export { mcpserver };
