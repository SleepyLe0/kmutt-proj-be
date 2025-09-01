FROM node:20-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm i

COPY src ./src

RUN npm run build          # 👈 runs tsc + tsc-alias

EXPOSE 3000

CMD ["npm", "start"]
