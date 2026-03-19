# ─────────────────────────────────────────────────────────────
# Root Dockerfile — Express Server (Legacy)
# This server is kept for compatibility but is optional.
# The React client primarily uses Supabase directly.
# ─────────────────────────────────────────────────────────────

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
