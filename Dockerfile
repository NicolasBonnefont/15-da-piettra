# Estágio de construção (build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package.json package-lock.json* ./
# Instalação otimizada de dependências
RUN npm ci

# Copiamos o código-fonte do projeto
COPY . .

# Realizamos o build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Instalamos apenas dependências de produção
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --only=production

# Copiamos o código compilado e arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./

# Criamos um usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expondo a porta padrão do Next.js
EXPOSE 3000

# Configurando o comando para iniciar a aplicação
CMD ["npm", "start"]