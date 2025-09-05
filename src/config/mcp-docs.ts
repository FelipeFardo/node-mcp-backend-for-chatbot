export const mcpOpenApiPaths = {
	"/mcp": {
		post: {
			tags: ["MCP"],
			summary: "🤖 Model Context Protocol - Endpoint para Tools",
			description: `
**🚀 Model Context Protocol (MCP) - JSON-RPC 2.0 Endpoint**

Este endpoint implementa o protocolo MCP para executar tools de forma padronizada.

**📋 Protocolo JSON-RPC 2.0:**
- Todas as requisições seguem o padrão JSON-RPC 2.0
- Autenticação obrigatória via JWT Bearer Token
- Suporte completo para tools

---

**🛠️ TOOLS DISPONÍVEIS**

**1. search_users**
- **Descrição:** Lista usuários filtrados por status
- **Parâmetros:**
  - \`status\` (string): "active" | "inactive"
- **Uso:** Ideal para chatbots listarem usuários ativos/inativos

**2. search_user_info**  
- **Descrição:** Retorna informações detalhadas do usuário autenticado
- **Parâmetros:** Nenhum (usa o JWT do header)
- **Uso:** Obter dados completos do usuário logado

---

---

**💡 EXEMPLOS DE USO**


**Listar Usuários Ativos:**
\`\`\`json
POST /mcp
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_users",
    "arguments": { "status": "active" }
  }
}
\`\`\`


**Informações do Usuário:**
\`\`\`json
POST /mcp
{
  "jsonrpc": "2.0",
  "id": 3, 
  "method": "tools/call",
  "params": {
    "name": "search_user_info",
    "arguments": {}
  }
}
\`\`\`

---

**📝 FORMATO DE RESPOSTA**

Todas as respostas seguem o padrão JSON-RPC 2.0:

\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Dados em JSON string"
      }
    ]
  }
}
\`\`\`

---

**🔒 AUTENTICAÇÃO**

- **Header obrigatório:** \`Authorization: Bearer <JWT_TOKEN>\`
- **Obtenção do token:** Use POST /auth com API Key
- **Validade:** Conforme configuração JWT do sistema

---

**🔧 MCP Inspector - Ferramenta de desenvolvimento**

**O que é o MCP Inspector?**
- Interface gráfica para testar e debugar servidores MCP
- Permite explorar tools interativamente
- Ideal para desenvolvimento e debugging

**🚀 Como usar:**

**1. Iniciar o Inspector:**
\`\`\`bash
npm run mcp
\`\`\`

---

**⚡ DICAS DE INTEGRAÇÃO**

1. **Para Chatbots:** Use tools para buscar dados dinâmicos
2. **Tratamento de Erro:** Sempre verifique o campo "error" na resposta
			`,
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "Accept",
					in: "header",
					required: true,
					description: "Tipos de conteúdo aceitos na resposta",
					schema: {
						type: "string",
						default: "application/json, text/event-stream",
					},
				},
			],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								jsonrpc: {
									type: "string",
									example: "2.0",
									description: "Versão do protocolo JSON-RPC (sempre '2.0')",
								},
								id: {
									type: "number",
									example: 1,
									description: "Identificador único da requisição",
								},
								method: {
									type: "string",
									enum: ["tools/call"],
									description: "Método MCP: 'tools/call' para executar tools",
								},
								params: {
									type: "object",
									description: "Parâmetros específicos do método",
									oneOf: [
										{
											title: "Tools Parameters",
											properties: {
												name: {
													type: "string",
													enum: ["search_users", "search_user_info"],
													description: "Nome da tool a ser executada",
												},
												arguments: {
													type: "object",
													description: "Argumentos específicos da tool",
												},
											},
											required: ["name", "arguments"],
										},
									],
								},
							},
							required: ["jsonrpc", "id", "method", "params"],
						},
						examples: {
							initialize: {
								summary: "🔄 Inicializar Sessão MCP",
								description:
									"Estabelece handshake obrigatório entre cliente e servidor, negociando capacidades e versão do protocolo antes de executar tools.",
								value: {
									method: "initialize",
									params: {
										protocolVersion: "2025-06-18",
										capabilities: {
											sampling: {},
											elicitation: {},
											roots: {
												listChanged: true,
											},
										},
										clientInfo: {
											name: "Node-Api-Mcp-Chatbot",
											version: "1.0.0",
										},
									},
									jsonrpc: "2.0",
									id: 0,
								},
							},
							search_active_users: {
								summary: "🔍 Buscar Usuários Ativos",
								description: "Lista todos os usuários com status 'active'",
								value: {
									jsonrpc: "2.0",
									id: 1,
									method: "tools/call",
									params: {
										name: "search_users",
										arguments: { status: "active" },
									},
								},
							},
							search_inactive_users: {
								summary: "🔍 Buscar Usuários Inativos",
								description: "Lista todos os usuários com status 'inactive'",
								value: {
									jsonrpc: "2.0",
									id: 2,
									method: "tools/call",
									params: {
										name: "search_users",
										arguments: { status: "inactive" },
									},
								},
							},
							get_user_info: {
								summary: "👤 Informações do Usuário",
								description: "Obtém dados completos do usuário autenticado",
								value: {
									jsonrpc: "2.0",
									id: 3,
									method: "tools/call",
									params: {
										name: "search_user_info",
										arguments: {},
									},
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "✅ Execução MCP bem-sucedida",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									jsonrpc: {
										type: "string",
										example: "2.0",
										description: "Versão do protocolo JSON-RPC",
									},
									id: {
										type: "number",
										example: 1,
										description: "ID da requisição original",
									},
									result: {
										type: "object",
										properties: {
											content: {
												type: "array",
												items: {
													type: "object",
													properties: {
														type: {
															type: "string",
															example: "text",
															description: "Tipo do conteúdo (sempre 'text')",
														},
														text: {
															type: "string",
															description:
																"Dados retornados em formato JSON string",
														},
													},
												},
											},
										},
										description: "Resultado da execução MCP",
									},
								},
							},
							examples: {
								users_response: {
									summary: "Resposta - Lista de Usuários",
									value: {
										jsonrpc: "2.0",
										id: 1,
										result: {
											content: [
												{
													type: "text",
													text: '[{"id":"123","name":"João Silva","email":"joao@email.com","status":"active"},{"id":"456","name":"Maria Santos","email":"maria@email.com","status":"active"}]',
												},
											],
										},
									},
								},
								user_info_response: {
									summary: "Resposta - Informações do Usuário",
									value: {
										jsonrpc: "2.0",
										id: 3,
										result: {
											content: [
												{
													type: "text",
													text: '{"id":"123","name":"João Silva","email":"joao@email.com","status":"active","createdAt":"2024-01-15"}',
												},
											],
										},
									},
								},
							},
						},
					},
				},
				400: {
					description: "❌ Requisição inválida - Erro no formato JSON-RPC",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									jsonrpc: { type: "string", example: "2.0" },
									id: { type: "number", example: 1 },
									error: {
										type: "object",
										properties: {
											code: { type: "number", example: -32600 },
											message: { type: "string", example: "Invalid Request" },
											data: { type: "object" },
										},
									},
								},
							},
							example: {
								jsonrpc: "2.0",
								id: 1,
								error: {
									code: -32600,
									message: "Invalid Request",
									data: { details: "Missing required field: method" },
								},
							},
						},
					},
				},
				401: {
					description: "🔒 Token JWT inválido ou ausente",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									error: {
										type: "string",
										example: "Unauthorized",
										description: "Tipo do erro",
									},
									message: {
										type: "string",
										example: "Token JWT inválido ou ausente",
										description: "Descrição detalhada do erro",
									},
									statusCode: {
										type: "number",
										example: 401,
										description: "Código HTTP do erro",
									},
								},
							},
							example: {
								error: "Unauthorized",
								message: "Token JWT inválido ou ausente",
								statusCode: 401,
							},
						},
					},
				},
				404: {
					description: "🔍 Tool ou Resource não encontrado",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									jsonrpc: { type: "string", example: "2.0" },
									id: { type: "number", example: 1 },
									error: {
										type: "object",
										properties: {
											code: { type: "number", example: -32601 },
											message: { type: "string", example: "Method not found" },
											data: { type: "object" },
										},
									},
								},
							},
							example: {
								jsonrpc: "2.0",
								id: 1,
								error: {
									code: -32601,
									message: "Method not found",
									data: {
										tool: "unknown_tool",
										available: ["search_users", "search_user_info"],
									},
								},
							},
						},
					},
				},
				500: {
					description: "🔥 Erro interno do servidor",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									jsonrpc: { type: "string", example: "2.0" },
									id: { type: "number", example: 1 },
									error: {
										type: "object",
										properties: {
											code: { type: "number", example: -32603 },
											message: { type: "string", example: "Internal error" },
											data: { type: "object" },
										},
									},
								},
							},
							example: {
								jsonrpc: "2.0",
								id: 1,
								error: {
									code: -32603,
									message: "Internal error",
									data: { details: "Database connection failed" },
								},
							},
						},
					},
				},
			},
		},
	},
};
