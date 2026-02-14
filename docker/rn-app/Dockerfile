FROM node:22-alpine

# Install git and openssh for version control
RUN apk add --no-cache git openssh-client

# Install Expo CLI globally
RUN npm install -g expo-cli

WORKDIR /app/rn-app

# Ensure the node user owns the workspace
RUN chown -R node:node /app

# Expose Expo development ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Default CMD, will be overridden by docker-compose.yml
CMD ["npm", "start"]
