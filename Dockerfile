FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy only required files
COPY index.js .
COPY dist/ ./dist/

# Use non-root user for security
USER node

# Use this port
EXPOSE 3000

# Run node
CMD ["node", "index.js"]