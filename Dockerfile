FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
  libreoffice \
  fontconfig \
  ttf-dejavu \
  msttcorefonts-installer \
  && update-ms-fonts || true \
  && fc-cache -f

COPY fonts/THSarabunPSK/ /usr/share/fonts/truetype/THSarabunPSK/
RUN fc-cache -f

COPY package*.json tsconfig.json ./

RUN npm i

COPY src ./src

RUN npm run build          

EXPOSE 3000

CMD ["npm", "start"]
