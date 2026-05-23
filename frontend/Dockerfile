# Use the latest stable Playwright image (recommended)
FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# (Optional) Install any additional browsers if needed
# RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]