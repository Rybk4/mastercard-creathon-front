
FROM node:20-alpine

WORKDIR /src/app

COPY package.json package-lock.json ./

RUN npm install --production

COPY dist ./dist
COPY vite.config.ts ./

EXPOSE 9001

CMD ["npm", "run", "preview"]
