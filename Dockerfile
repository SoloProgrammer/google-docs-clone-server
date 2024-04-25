FROM node:alpine
WORKDIR /server
COPY package.json .
COPY tsconfig.json .
RUN npm install\
    && npm install typescript -g
COPY . .
RUN tsc
CMD ["node", "./dist/server.js"]