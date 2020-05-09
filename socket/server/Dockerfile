# dockerfile;;; multi stage builds
# the first image use node image as the builder because it has git program
FROM node as builder

WORKDIR /app

COPY ["./package.json", "yarn.lock", "/app/"]

RUN yarn install --frozen-lockfile

COPY "./" "/app/"

## compile typescript
RUN yarn build

## remove packages of devDependencies
RUN yarn install --production --ignore-scripts --prefer-offline

# ===============
# the second image use node:slim image as the runtime
FROM node:slim as runtime

WORKDIR /app
ENV NODE_ENV=production

## Copy the necessary files form builder
COPY --from=builder "/app/dist/" "/app/dist/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"

CMD ["yarn", "start:prod"]

# create image docker build -t socketapp .
# use docker run -it -d -p 6001:6001 --name socketapp socketapp to start
# to remove container use docker container rm -f socketapp