FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD sh -c "echo 'Waiting for Hardhat node...' && \
sleep 60 && \
echo 'Deploying contract...' && \
npx hardhat run scripts/deploy.cjs --network localhost && \
echo 'Starting backend API...' && \
node server.js"