FROM node:alpine

RUN yarn config set registry https://registry.npm.taobao.org/

RUN mkdir /app
COPY . /app 
WORKDIR /app
RUN rm -rf node_modules docker && rm .env && yarn

EXPOSE 8001

CMD ["node", "app.js"]