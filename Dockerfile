FROM alpine AS build
RUN apk add nodejs npm
WORKDIR /app
COPY package*.json ./
COPY tsconfig.build.json ./
RUN npm install -g @nestjs/cli
RUN npm install --omit=dev
COPY . .
RUN npm run build

FROM alpine
RUN apk add nodejs
RUN mkdir /buffer
WORKDIR /app
COPY --from=build /app/.env ./.env
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/src/main.js"]
