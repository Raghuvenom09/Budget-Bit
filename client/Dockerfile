# ─────────────────────────────────────────────────────────────
# Client Dockerfile — React + Vite
# Build: docker build -t budget-bit-client ./client
# Run:   docker run -p 5173:80 budget-bit-client
# ─────────────────────────────────────────────────────────────

# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_AI_BASE_URL

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_AI_BASE_URL=$VITE_AI_BASE_URL

RUN npm run build

# ── Production stage ─────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
