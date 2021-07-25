FROM node

COPY index.js /docker/index.js

CMD [ "node", "index.js" ]