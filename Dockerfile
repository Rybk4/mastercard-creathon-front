FROM node:20-alpine AS builder
WORKDIR /src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /src/app

COPY --from=builder /src/app/node_modules ./node_modules

COPY package.json vite.config.ts ./

COPY --from=builder /src/app/dist ./dist

EXPOSE 9204

CMD [ "npm", "run", "preview" ]