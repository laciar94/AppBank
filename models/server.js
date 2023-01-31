const express = require('express');
const cors = require('cors');
const { usersRouter } = require('../routes/user.routes');
const { db } = require('../database/db');

const { transferRouter } = require('../routes/transfer.routes');

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
    this.app.all('*', (req, res, next) => {
      res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`,
      });
    });
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
