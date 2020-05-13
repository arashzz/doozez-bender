FROM ubuntu:18.04

RUN mkdir -p "/mongodb/db"
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get install -y gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add - && \
    echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list && \
    apt-get update && \
    apt-get install -y mongodb-org
# RUN service mongod start 