# 📚 Guia Completo da API - Exemplos Práticos

## 🎯 Visão Geral

Este guia fornece exemplos práticos de como usar a API Node MCP Chatbot em diferentes cenários reais. Todos os exemplos incluem requisições e respostas completas.

## 🔐 Fluxo de Autenticação

### Passo 1: Obter Token JWT

**Requisição:**
```http
POST http://localhost:3333/auth
Content-Type: application/json
apiKey: sua_chave_de_api_para_rotas_protegidas

{
  "phoneNumber": "5555123456789"
}
```

**Resposta (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTY0MTA4MTYwMH0.signature"
}
```

**Possíveis Erros:**
```json
// 400 Bad Request - Telefone inválido
{
  "error": "Bad Request",
  "message": "Invalid credentials.",
  "statusCode": 400
}

// 403 Forbidden - API Key inválida
{
  "error": "Forbidden",
  "message": "Invalid API key",
  "statusCode": 403
}
```

### Passo 2: Usar Token para Acessar Recursos

**Requisição:**
```http
GET http://localhost:3333/me
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João da Silva",
  "email": "joao.silva@exemplo.com",
  "phone": "5555123456789",
  "status": "active",
  "emailVerified": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🤖 Exemplos MCP

### Tool: Buscar Usuários Ativos

**Requisição:**
```http
POST http://localhost:3333/mcp
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_users",
    "arguments": {
      "status": "active"
    }
  }
}
```

**Resposta:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "[{\"id\":\"123e4567-e89b-12d3-a456-426614174000\",\"name\":\"João Silva\",\"email\":\"joao@exemplo.com\",\"phone\":\"5555123456789\",\"status\":\"active\",\"createdAt\":\"2024-01-10T08:00:00.000Z\"},{\"id\":\"456e7890-e89b-12d3-a456-426614174001\",\"name\":\"Maria Santos\",\"email\":\"maria@exemplo.com\",\"phone\":\"5555987654321\",\"status\":\"active\",\"createdAt\":\"2024-01-12T09:15:00.000Z\"}]"
      }
    ]
  }
}
```

### Tool: Informações do Usuário Autenticado

**Requisição:**
```http
POST http://localhost:3333/mcp
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "search_user_info",
    "arguments": {}
  }
}
```

**Resposta:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"id\":\"123e4567-e89b-12d3-a456-426614174000\",\"name\":\"João Silva\",\"email\":\"joao@exemplo.com\",\"phone\":\"5555123456789\",\"status\":\"active\",\"emailVerified\":\"2024-01-15T10:30:00.000Z\",\"createdAt\":\"2024-01-10T08:00:00.000Z\",\"updatedAt\":\"2024-01-15T10:30:00.000Z\"}"
      }
    ]
  }
}
```

### Resource: Dívidas do Usuário

**Requisição:**
```http
POST http://localhost:3333/mcp
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/read",
  "params": {
    "uri": "debts://me"
  }
}
```

**Resposta:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "contents": [
      {
        "uri": "debts://me/123e4567-e89b-12d3-a456-426614174001",
        "text": "{\"id\":\"123e4567-e89b-12d3-a456-426614174001\",\"userId\":\"123e4567-e89b-12d3-a456-426614174000\",\"description\":\"Financiamento do veículo Honda Civic 2020\",\"amount\":\"25000.50\",\"dueDate\":\"2024-12-31T23:59:59.000Z\",\"paidAt\":null,\"status\":\"pending\",\"createdAt\":\"2024-01-01T00:00:00.000Z\",\"updatedAt\":\"2024-01-01T00:00:00.000Z\"}"
      },
      {
        "uri": "debts://me/456e7890-e89b-12d3-a456-426614174002",
        "text": "{\"id\":\"456e7890-e89b-12d3-a456-426614174002\",\"userId\":\"123e4567-e89b-12d3-a456-426614174000\",\"description\":\"Cartão de crédito - fatura em atraso\",\"amount\":\"3500.75\",\"dueDate\":\"2024-02-15T23:59:59.000Z\",\"paidAt\":null,\"status\":\"overdue\",\"createdAt\":\"2024-01-15T00:00:00.000Z\",\"updatedAt\":\"2024-02-16T10:00:00.000Z\"}"
      }
    ]
  }
}
```

## 🚨 Tratamento de Erros

### Erro de Autenticação JWT

**Requisição com token inválido:**
```http
GET http://localhost:3333/me
Authorization: Bearer token_invalido
```

**Resposta (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid token",
  "statusCode": 401
}
```

### Erro de MCP - Tool não encontrada

**Requisição:**
```http
POST http://localhost:3333/mcp
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tool_inexistente",
    "arguments": {}
  }
}
```

**Resposta:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found",
    "data": "Tool 'tool_inexistente' not found"
  }
}
```

## 💻 Exemplos de Código

### JavaScript/TypeScript Client

```typescript
class ChatbotAPIClient {
  private baseURL: string;
  private apiKey: string;
  private token?: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async authenticate(phoneNumber: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth`, {
      method: 'POST',
      headers: {
        'apiKey': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber })
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.token = data.token;
  }

  async getUserProfile() {
    return this.request('GET', '/me');
  }

  async searchUsers(status: 'active' | 'inactive') {
    return this.mcpCall('search_users', { status });
  }

  async getUserInfo() {
    return this.mcpCall('search_user_info', {});
  }

  async getUserDebts() {
    return this.mcpResource('debts://me');
  }

  private async request(method: string, endpoint: string, body?: any) {
    if (!this.token) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Request failed: ${error.message}`);
    }

    return response.json();
  }

  private async mcpCall(toolName: string, arguments: any) {
    return this.request('POST', '/mcp', {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments
      }
    });
  }

  private async mcpResource(uri: string) {
    return this.request('POST', '/mcp', {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'resources/read',
      params: { uri }
    });
  }
}

// Exemplo de uso
async function exemploUso() {
  const client = new ChatbotAPIClient(
    'http://localhost:3333',
    'sua_chave_de_api_para_rotas_protegidas'
  );

  try {
    // Autenticar
    await client.authenticate('5555123456789');
    console.log('✅ Autenticado com sucesso');

    // Buscar perfil
    const profile = await client.getUserProfile();
    console.log('👤 Perfil:', profile);

    // Buscar dívidas
    const debts = await client.getUserDebts();
    const debtList = debts.result.contents.map(debt => JSON.parse(debt.text));
    console.log('💰 Dívidas encontradas:', debtList.length);

    // Calcular total de dívidas
    const totalDebt = debtList.reduce((sum, debt) => 
      sum + parseFloat(debt.amount), 0
    );
    console.log('💸 Total em dívidas: R$', totalDebt.toFixed(2));

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}
```

### Python Client

```python
import requests
import json
from typing import Optional, Dict, Any

class ChatbotAPIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key
        self.token: Optional[str] = None

    def authenticate(self, phone_number: str) -> None:
        """Autentica o usuário e obtém token JWT"""
        response = requests.post(
            f"{self.base_url}/auth",
            headers={
                "apiKey": self.api_key,
                "Content-Type": "application/json"
            },
            json={"phoneNumber": phone_number}
        )
        
        if response.status_code != 201:
            raise Exception(f"Auth failed: {response.text}")
        
        self.token = response.json()["token"]

    def get_user_profile(self) -> Dict[str, Any]:
        """Busca perfil do usuário autenticado"""
        return self._request("GET", "/me")

    def search_users(self, status: str) -> Dict[str, Any]:
        """Busca usuários por status"""
        return self._mcp_call("search_users", {"status": status})

    def get_user_debts(self) -> Dict[str, Any]:
        """Busca dívidas do usuário"""
        return self._mcp_resource("debts://me")

    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Faz requisição HTTP autenticada"""
        if not self.token:
            raise Exception("Not authenticated. Call authenticate() first.")

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        response = requests.request(
            method=method,
            url=f"{self.base_url}{endpoint}",
            headers=headers,
            json=data
        )

        if not response.ok:
            raise Exception(f"Request failed: {response.text}")

        return response.json()

    def _mcp_call(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Chama tool MCP"""
        return self._request("POST", "/mcp", {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        })

    def _mcp_resource(self, uri: str) -> Dict[str, Any]:
        """Acessa resource MCP"""
        return self._request("POST", "/mcp", {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "resources/read",
            "params": {"uri": uri}
        })

# Exemplo de uso
if __name__ == "__main__":
    client = ChatbotAPIClient(
        "http://localhost:3333",
        "sua_chave_de_api_para_rotas_protegidas"
    )

    try:
        # Autenticar
        client.authenticate("5555123456789")
        print("✅ Autenticado com sucesso")

        # Buscar perfil
        profile = client.get_user_profile()
        print(f"👤 Usuário: {profile['name']}")

        # Buscar dívidas
        debts_response = client.get_user_debts()
        debts = [json.loads(debt["text"]) for debt in debts_response["result"]["contents"]]
        
        total_debt = sum(float(debt["amount"]) for debt in debts)
        print(f"💰 Total de dívidas: R$ {total_debt:.2f}")

    except Exception as e:
        print(f"❌ Erro: {e}")
```

## 🔍 Testando com MCP Inspector

### Configuração

1. **Instalar e executar:**
   ```bash
   npm run mcp
   ```

2. **Configurar conexão:**
   - URL: `http://localhost:3333/mcp`
   - Method: POST
   - Headers: `Authorization: Bearer <seu_jwt_token>`

3. **Testar tools e resources com os exemplos JSON acima**

### Dicas de Teste

- ✅ Sempre teste primeiro a autenticação
- ✅ Verifique se o token JWT está válido
- ✅ Use diferentes payloads para validar a validação
- ✅ Teste cenários de erro (tokens inválidos, parâmetros incorretos)
- ✅ Monitore os logs do servidor para debug

## 📊 Health Check e Monitoramento

### Health Check Básico

**Requisição:**
```http
GET http://localhost:3333/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### Monitoramento Avançado

Para produção, considere implementar:

- **Logs estruturados** com timestamp e níveis
- **Métricas de performance** (latência, throughput)
- **Health checks detalhados** (banco, dependências externas)
- **Rate limiting** para proteção contra abuso
- **Alertas** para erros críticos

---

**📝 Nota:** Este guia cobre os cenários mais comuns de uso da API. Para casos específicos, consulte a documentação interativa em `/docs` ou o código fonte no GitHub.
