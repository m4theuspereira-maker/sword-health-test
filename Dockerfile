FROM node:18-alpine

ENV NODE_ENV production

WORKDIR /app

COPY dist /app/
COPY node_modules /app/node_modules
COPY yarn.lock /app/yarn.lock

CMD ["node", "./index.js"]

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

EXPOSE 3000
