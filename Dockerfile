FROM node:10.8-slim

ENV APP_PATH /app

COPY . ${APP_PATH}
# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.

WORKDIR ${APP_PATH}

RUN npm install --unsafe-perm || ((if [ -f npm-debug.log ]; then cat npm-debug.log; fi) && false)

# add `/usr/src/node_modules/.bin` to $PATH
ENV PATH ${APP_PATH}/node_modules/.bin:$PATH

WORKDIR ${APP_PATH}/frontend

RUN yarn
# RUN npm install

# RUN npm run build
RUN yarn build

WORKDIR ${APP_PATH}

RUN npm run build
CMD npm start
