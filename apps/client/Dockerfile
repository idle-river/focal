FROM oven/bun:latest

WORKDIR /app

# Copy root manifest files and workspace packages needed for bun workspaces
COPY package.json ./
COPY apps ./apps
COPY packages ./packages

# Install workspace dependencies from repo root
RUN bun install

# Build the client
WORKDIR /app/apps/client
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]