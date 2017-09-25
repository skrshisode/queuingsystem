/*global broker*/
'use strict';

global.Promise = require('bluebird');

/**
 * Dependencies
 */
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();

module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  //Error handler
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500);
    return res.json({
      message: err.message,
    });
  });
});

/**
* =============================================================================
* Extend the express app here
* =============================================================================
*/
const cors = require('cors');
const shrinkRay = require('shrink-ray');
const toobusy = require('toobusy-js');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/swagger/swagger.json');

app.set('trust proxy', 'loopback');
require('./scripts/db-init')();
app.use((req, res, next) => {
  if (toobusy()) {
    return res.status(503).json({
      'message': 'Server too busy. Come back later!',
    });
  }
  else {
    next();
  }
});
app.set('x-powered-by', false);
app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(shrinkRay());

const showExplorer = true;
const options = {};
const customCss = '#swagger-ui { margin: auto; width: 75% }';
app.use('/api/v0/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,
                                        showExplorer, options, customCss));
