FROM node

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV FAST_REFRESH false

COPY . .

RUN npm install

CMD ["npm", "start"]
