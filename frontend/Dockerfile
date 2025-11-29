FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --progress=false
COPY . .
RUN npm run build
EXPOSE 5174
CMD ["npm", "run", "preview"]
