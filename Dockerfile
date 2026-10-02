FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
# Mount a Render disk at /var/data and set DATA_DIR=/var/data (or set DATABASE_URL)
# in the dashboard, otherwise the ledger is wiped on every deploy.
ENV PORT=10000
EXPOSE 10000
CMD ["node", "server-prod.mjs"]
