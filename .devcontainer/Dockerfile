# Installs debian 12 with nodejs and typescript
# https://hub.docker.com/_/microsoft-devcontainers-typescript-node
ARG node_version=20-bookworm
FROM mcr.microsoft.com/devcontainers/typescript-node:${node_version}

RUN apt-get update && apt-get upgrade

RUN sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - 

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install postgresql-client-16 \
    && apt-get -y install libvips

