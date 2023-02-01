const express = require('express');
const cors = require('cors');
const { usersRouter } = require('../routes/user.routes');
const { db } = require('../database/db');

const { transferRouter } = require('../routes/transfer.routes');
const globalErrorHandler = require('../controllers/error.controller');

class Server {
  constructor() {
    this.app = express();

    this.port = process.env.PORT || 3000;

    this.paths = {
      user: '/api/v1/user',
      transfer: '/api/v1/transfer',
    };

    this.database();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.user, usersRouter);
    this.app.use(this.paths.transfer, transferRouter);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is running on port', this.port);
    });
  }
}

module.exports = Server;
