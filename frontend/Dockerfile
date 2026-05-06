FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# These must stay together so the build process 'sees' them
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Diagnostic: This will print the URL in the Jenkins logs so we can verify it
RUN echo "Building frontend with API URL: $VITE_API_BASE_URL"

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=0 /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]