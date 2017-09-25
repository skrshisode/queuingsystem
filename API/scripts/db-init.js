'use strict';

/**
 * Dependencies
 */
const path = require('path');
const glob = require('glob-all');
const mongoose = require('mongoose');
const DB = {
  'host': process.env.MONGO_HOST || 'localhost',
  'port': 27017,
  'db': 'ola',
};

const config = {
  DB_URI: 'mongodb://' + DB.host + ':' + DB.port + '/' + DB.db,
  DB_USER: '',
  DB_PASS: '',
  DB_DEBUG: true,
  DB_AUTO_INDEX: true,
};

/**
 * Configure mongoose
 */
mongoose.Promise = require('bluebird');
mongoose.plugin(require('meanie-mongoose-to-json'));
mongoose.plugin(require('meanie-mongoose-set-properties'));

/**
 * Helper to check if an ID is an object ID
 */
mongoose.isObjectId = function(id) {
  return (id instanceof mongoose.Types.ObjectId);
};

/**
 * Wrapper to enable overriding of configuration options
 */
module.exports = function(options) {

  //Extend main config options
  const cfg = Object.assign({}, {
    uri: config.DB_URI,
    user: config.DB_USER,
    pass: config.DB_PASS,
    debug: config.DB_DEBUG,
    autoIndex: config.DB_AUTO_INDEX,
  }, options || {});

  //Connect to database
  console.log('Connecting to database', cfg.uri, '...');
  mongoose.set('debug', cfg.debug);
  mongoose.connect(cfg.uri, {
    useMongoClient: true,
    // user: cfg.user,
    // pass: cfg.pass,
    // config: {
    //   autoIndex: cfg.autoIndex,
    // },
  });

  //Handle connection events
  mongoose.connection.on('error', error => {
    console.log('Database error:');
    console.log(error.stack || error);
    process.exit(-1);
  });
  mongoose.connection.on('connected', () => {
    console.log('Database connected @', cfg.uri);
  });

  //Load models
  console.log('Loading model files...');
  glob.sync(['api/models/*.model.js']).forEach(modelPath => {
    console.log('Loaded -> ', modelPath);
    require(path.resolve(modelPath));
  });
};
