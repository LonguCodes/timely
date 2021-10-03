# build environment
FROM node:14.17

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
RUN npm install
COPY src/ src
COPY webpack.config.js .
COPY types.d.ts .
COPY tsconfig.json .
COPY .babelrc .
RUN ls
RUN npm run build

# production environment
FROM arm32v7/nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
