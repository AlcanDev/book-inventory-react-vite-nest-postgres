# ---------- Build ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Solo deps de producción
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
# Copiamos el build
COPY --from=builder /app/dist ./dist
# Copiamos migrations/seeders/config para job de migración usando esta misma imagen si hace falta
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeders ./seeders
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/sequelize-cli.config.js ./sequelize-cli.config.js

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
