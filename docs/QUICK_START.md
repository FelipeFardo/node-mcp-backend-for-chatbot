# 🚀 Guia de Início Rápido - Node MCP Chatbot API

## ⚡ Configuração Rápida (5 minutos)

### 1. 📋 Pré-requisitos
- Node.js 18+ instalado
- Docker e Docker Compose
- Git para clonar o repositório

### 2. 🔽 Clonar e Instalar

```bash
# Clonar repositório
git clone https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot.git
cd Node-Api-Mcp-Chatbot

# Instalar dependências
npm install
```

### 3. 🐳 Configurar Banco de Dados

```bash
# Subir PostgreSQL com Docker
docker compose up -d

# Verificar se está rodando
docker ps
```

### 4. ⚙️ Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5433/chatbot
JWT_SECRET=sua_chave_jwt_super_segura_aqui_128_bits_minimo
APIKEY=sua_chave_de_api_para_rotas_protegidas
```

### 5. 🗄️ Configurar Banco

```bash
# Executar migrações
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed
```

### 6. 🚀 Iniciar Servidor

```bash
# Modo desenvolvimento
npm run dev
```

**✅ Pronto!** Servidor rodando em: http://localhost:3333

## 🧪 Teste Rápido

### 1. Health Check
```bash
curl http://localhost:3333/health
```

### 2. Documentação Interativa
Abra no navegador: http://localhost:3333/docs

### 3. Primeiro Login (via curl)

```bash
# Obter token JWT
curl -X POST http://localhost:3333/auth \
  -H "apiKey: sua_chave_de_api_para_rotas_protegidas" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "5555123456789"}'
```

### 4. Buscar Perfil

```bash
# Substitua <TOKEN> pelo token obtido acima
curl -X GET http://localhost:3333/me \
  -H "Authorization: Bearer <TOKEN>"
```

## 🤖 Teste MCP Inspector

```bash
# Abrir MCP Inspector
npm run mcp

# Conectar em: http://localhost:3333/mcp
# Header: Authorization: Bearer <seu_token>
```

## 📚 Próximos Passos

1. **📖 Leia a documentação completa** no README.md
2. **🔍 Explore a API** em `/docs`
3. **💻 Veja exemplos práticos** em `docs/API_EXAMPLES.md`
4. **🤖 Teste ferramentas MCP** com o Inspector
5. **🔧 Customize** conforme suas necessidades

## 🚨 Problemas Comuns

### Docker não inicia
```bash
# Verificar se Docker está rodando
docker --version
docker compose --version

# Limpar containers antigos
docker compose down
docker compose up -d
```

### Erro de migração
```bash
# Limpar e recriar banco
docker compose down -v
docker compose up -d
npm run db:migrate
```

### Porta já em uso
```bash
# Verificar processo na porta 3333
lsof -i :3333

# Ou alterar porta no .env
PORT=3334
```

## 📞 Suporte

- **🐛 Bugs:** [GitHub Issues](https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot/issues)
- **❓ Dúvidas:** [GitHub Discussions](https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot/discussions)
- **📧 Contato:** felipe.fardo@exemplo.com

---

**🎉 Parabéns!** Você configurou com sucesso a API Node MCP Chatbot. Agora você pode começar a desenvolver seu chatbot de renegociação de dívidas!
