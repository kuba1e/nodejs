FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build

FROM node:18-alpine AS final
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
ENV PORT=5000
EXPOSE 5000
CMD [ "yarn", "start" ]