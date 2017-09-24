FROM node:7.4.0

# Create app directory
RUN mkdir -p /data/app
WORKDIR /data/app

# Install app dependencies
COPY package.json /data/app/
RUN npm install

# Bundle app source
COPY . /data/app

CMD ["npm","start"]
