FROM oven/bun:latest

WORKDIR /app

# Copy root manifest files and workspace packages so bun can resolve workspaces
COPY package.json ./
COPY apps ./apps
COPY packages ./packages

# Install workspace dependencies from repo root
RUN bun install

# Run server from its app folder
WORKDIR /app/apps/server

EXPOSE 3000

CMD ["bun", "run", "start"]