'use strict';

const express = require(`express`);
const path = require(`path`);
const {DEFAULT_PORT_FRONT, PUBLIC_DIR, UPLOAD_DIR, TEMPLATES_DIR} = require(`../const`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT_FRONT, (error) => {
  if (error) {
    return console.error(`Error while hosting front server: ${error.message}`);
  }
  return console.info(`Listening to port: ${DEFAULT_PORT_FRONT}`);
});
