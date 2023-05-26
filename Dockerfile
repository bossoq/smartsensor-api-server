FROM node:16-buster-slim

WORKDIR /app

COPY package.json yarn.lock ./

COPY tsconfig.json .

RUN echo "deb http://ftp.debianclub.org/debian buster main" > /etc/apt/sources.list && \
    echo "deb http://ftp.debianclub.org/debian-security buster/updates main" >> /etc/apt/sources.list && \
    echo "deb http://ftp.debianclub.org/debian buster-updates main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y git

RUN yarn

COPY /src ./src

COPY config.json ./src/

EXPOSE 3000

EXPOSE 6668

CMD ["yarn", "dev"]
