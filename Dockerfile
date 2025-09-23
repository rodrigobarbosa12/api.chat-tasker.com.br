# Fase de build
FROM node:22.14-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

# Fase de produção
FROM node:22.14-alpine AS production

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3002

CMD ["npm", "run", "start:prod"]
