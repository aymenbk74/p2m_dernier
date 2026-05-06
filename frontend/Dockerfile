FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve the production build
FROM node:20-alpine
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy the built files from the first stage
COPY --from=0 /app/dist ./dist

EXPOSE 3000

# FIXED: Simplified command to ensure 0.0.0.0 binding
CMD ["serve", "-s", "dist", "-l", "3000"]