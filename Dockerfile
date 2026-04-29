# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]