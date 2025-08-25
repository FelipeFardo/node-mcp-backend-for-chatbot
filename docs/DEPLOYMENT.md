# 🚀 Guia de Deploy e Produção

## 🏗️ Preparando para Produção

### 📋 Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Chaves JWT e API Key seguras (32+ caracteres)
- [ ] Banco de dados de produção configurado
- [ ] HTTPS configurado
- [ ] Rate limiting implementado
- [ ] Logs estruturados habilitados
- [ ] Health checks configurados
- [ ] Monitoramento implementado

## 🔐 Segurança em Produção

### 1. Variáveis de Ambiente Seguras

```env
# Produção - .env
NODE_ENV=production
PORT=3333

# Database (use connection pooling)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Security (use strong keys!)
JWT_SECRET=uma_chave_jwt_super_segura_de_pelo_menos_32_caracteres_aleatoria
APIKEY=chave_api_complexa_para_producao_com_numeros_e_simbolos_123456

# Optional: Additional security
CORS_ORIGIN=https://seudomain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### 2. Configurações de Segurança Adicionais

```typescript
// src/http/server.ts - Adicione estas configurações para produção

import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';

// Helmet para headers de segurança
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
});

// Rate limiting
await app.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  errorResponseBuilder: (request, context) => ({
    error: 'Too Many Requests',
    message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds`,
    statusCode: 429
  })
});

// CORS mais restritivo
await app.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN || false,
  credentials: true
});
```

## 🐳 Deploy com Docker

### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs

EXPOSE 3333

ENV PORT=3333

CMD ["node", "dist/http/server.js"]
```

### 2. docker-compose.prod.yml

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/chatbot
      - JWT_SECRET=${JWT_SECRET}
      - APIKEY=${APIKEY}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3333/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: chatbot
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Configuração Nginx

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream api {
        server app:3333;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name seudominio.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name seudominio.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        location / {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        location /health {
            access_log off;
            proxy_pass http://api/health;
        }
    }
}
```

## ☁️ Deploy em Plataformas Cloud

### 1. Render (Recomendado para MVPs)

```yaml
# render.yaml
services:
  - type: web
    name: node-mcp-chatbot
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: chatbot-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: APIKEY
        generateValue: true

databases:
  - name: chatbot-db
    databaseName: chatbot
    user: postgres
```

### 2. Heroku

```json
{
  "name": "node-mcp-chatbot",
  "description": "Node MCP Chatbot API",
  "repository": "https://github.com/FelipeFardo/Node-Api-Mcp-Chatbot",
  "keywords": ["node", "fastify", "mcp", "chatbot", "api"],
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ],
  "addons": [
    {
      "plan": "heroku-postgresql:mini"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "JWT_SECRET": {
      "generator": "secret"
    },
    "APIKEY": {
      "generator": "secret"
    }
  },
  "scripts": {
    "postdeploy": "npm run db:migrate:deploy"
  }
}
```

### 3. Railway

```toml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[variables]
NODE_ENV = "production"
PORT = "3333"
```

## 📊 Monitoramento e Logs

### 1. Logging Estruturado

```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  } : undefined,
  base: {
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version
  }
});

// Usage em rotas
app.addHook('onRequest', async (request, reply) => {
  request.log.info({
    method: request.method,
    url: request.url,
    userAgent: request.headers['user-agent']
  }, 'Request received');
});

app.addHook('onResponse', async (request, reply) => {
  request.log.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: reply.getResponseTime()
  }, 'Request completed');
});
```

### 2. Health Check Avançado

```typescript
// src/http/routes/health.ts
export async function health(app: FastifyInstance) {
  app.get('/health', {
    schema: {
      summary: 'Health check detalhado',
      tags: ['Health'],
      response: {
        200: z.object({
          status: z.enum(['ok', 'warning', 'error']),
          timestamp: z.string(),
          uptime: z.number(),
          version: z.string(),
          database: z.object({
            status: z.enum(['connected', 'disconnected']),
            responseTime: z.number()
          }),
          memory: z.object({
            used: z.number(),
            total: z.number(),
            percentage: z.number()
          })
        })
      }
    }
  }, async (request, reply) => {
    const startTime = Date.now();
    
    // Test database connection
    let dbStatus = 'connected';
    let dbResponseTime = 0;
    
    try {
      const dbStart = Date.now();
      await db.execute(sql`SELECT 1`);
      dbResponseTime = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'disconnected';
      request.log.error(error, 'Database health check failed');
    }

    // Memory usage
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    
    const healthStatus = dbStatus === 'connected' ? 'ok' : 'error';
    
    const response = {
      status: healthStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus,
        responseTime: dbResponseTime
      },
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: Math.round((usedMemory / totalMemory) * 100)
      }
    };

    const statusCode = healthStatus === 'ok' ? 200 : 503;
    return reply.code(statusCode).send(response);
  });
}
```

### 3. Métricas com Prometheus

```typescript
// src/lib/metrics.ts
import promClient from 'prom-client';

// Create a Registry
const register = new promClient.Registry();

// Metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const mcpCallsTotal = new promClient.Counter({
  name: 'mcp_calls_total',
  help: 'Total number of MCP calls',
  labelNames: ['tool', 'status']
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(mcpCallsTotal);

// Default metrics
promClient.collectDefaultMetrics({ register });

export { register, httpRequestDuration, httpRequestsTotal, mcpCallsTotal };
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Database Connection Issues**
   ```bash
   # Verificar conexão
   npx drizzle-kit studio
   
   # Test connection string
   psql "postgresql://user:password@host:port/database"
   ```

2. **Memory Leaks**
   ```bash
   # Monitor memory usage
   node --inspect dist/http/server.js
   
   # Profile memory
   clinic doctor -- node dist/http/server.js
   ```

3. **Performance Issues**
   ```bash
   # Profile performance
   clinic flame -- node dist/http/server.js
   
   # Load testing
   autocannon http://localhost:3333/health
   ```

### Scripts de Manutenção

```bash
# scripts/backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_${DATE}.sql"
echo "Backup criado: backup_${DATE}.sql"

# scripts/health-check.sh
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/health)
if [ $response != "200" ]; then
  echo "Health check failed: $response"
  exit 1
fi
echo "Health check passed"
```

## 📈 Otimizações de Performance

### 1. Database Optimization

```typescript
// Connection pooling
const db = drizzle(postgres(env.DATABASE_URL, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10
}));

// Indexes nas tabelas principais
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_debts_user_id ON debts(user_id);
CREATE INDEX idx_debts_status ON debts(status);
CREATE INDEX idx_debts_due_date ON debts(due_date);
```

### 2. Caching

```typescript
// Redis cache para dados frequentes
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache user data
const getUserCached = async (userId: string) => {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });
  
  await redis.setex(`user:${userId}`, 300, JSON.stringify(user)); // 5min cache
  return user;
};
```

---

**🎯 Conclusão:** Este guia cobre os aspectos essenciais para deploy em produção. Adapte as configurações conforme suas necessidades específicas e sempre teste em ambiente de staging antes do deploy final.
