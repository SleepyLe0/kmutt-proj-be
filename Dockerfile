FROM node:20-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY src ./src

RUN npm run build          # 👈 runs tsc + tsc-alias

EXPOSE 4000

CMD ["npm", "start"]
