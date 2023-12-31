# Use the official Node.js image with tag 20
FROM node

WORKDIR /usr/src/app

#COPY package*.json ./

#RUN npm install
#RUN npm install -g next

COPY . .
#RUN npm run dev
#CMD ["npm", "run", "dev", "&"]
#RUN npm run build

EXPOSE 3000

CMD ["npm" ,"start"]
