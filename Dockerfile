FROM node:16-buster-slim

WORKDIR /app

COPY package.json .

COPY tsconfig.json .

RUN echo "deb http://ftp.debianclub.org/debian buster main" > /etc/apt/sources.list && \
    echo "deb http://ftp.debianclub.org/debian-security buster/updates main" >> /etc/apt/sources.list && \
    echo "deb http://ftp.debianclub.org/debian buster-updates main" >> /etc/apt/sources.list && \
    apt-get update

RUN yarn

COPY /src ./src

COPY config.json ./src/

CMD ["yarn", "dev"]
