FROM node:carbon

WORKDIR /usr/src/react-face-recognition-brain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]