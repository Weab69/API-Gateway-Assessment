FROM node:20-alpine

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

# Move prisma generate to runtime to avoid build-time network issues
CMD ["sh", "-c", "npx prisma generate && npm run build && npx prisma db push && node dist/main.js"]
