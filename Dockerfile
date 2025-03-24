# ==========================================================
# ETAPA DE COMPILACIÓN
# ==========================================================
FROM node:22-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos package.json primero (para mejor caché)
COPY package.json ./
# Intentar copiar package-lock.json, pero no fallar si no existe
COPY package-lock.json* ./

# Instalar dependencias eficientemente (usando ci si existe package-lock.json)
RUN if [ -f package-lock.json ]; then \
        npm ci; \
    else \
        echo "No se encontró package-lock.json, usando npm install en su lugar"; \
        npm install; \
    fi

# Copiar el resto del código fuente
COPY . .

# Asegurar que la variable de entorno se aplica durante la compilación
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Compilar la aplicación
RUN npm run build
RUN echo "URL de API usada durante la compilación: $VITE_API_BASE_URL"

# ==========================================================
# ETAPA DE EJECUCIÓN
# ==========================================================
FROM node:22-alpine

# Instalar serve para servir la aplicación
RUN npm install -g serve

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos compilados desde la etapa de compilación
COPY --from=build /app/dist /app

# Exponer puerto
EXPOSE 5173

# Comando para servir la aplicación con CORS habilitado
CMD ["serve", "-s", ".", "-l", "5173", "--cors"]