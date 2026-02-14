FROM node:22-alpine

# Install Java Runtime (required by Firebase emulators) and curl for healthcheck
RUN apk add --no-cache openjdk21-jre curl

# Install Firebase CLI globally
RUN npm install -g firebase-tools@latest

WORKDIR /app

# Expose necessary ports
EXPOSE 4000
EXPOSE 8080
EXPOSE 9099
EXPOSE 5001
EXPOSE 4400

# The CMD will be overridden by the docker-compose.yml 'command'
# but it's good practice for standalone runs.
CMD ["firebase", "emulators:start"]
