FROM node:20
RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install
COPY . /app
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build"]