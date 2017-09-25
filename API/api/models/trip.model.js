'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Trip schema
 */
const TripSchema = new Schema({
  createdOn: {type: Date},
  deletedOn: {type: Date, default: null},
  updatedOn: {type: Date, default: Date.now},
  requestId: {type: String, maxlength: 64, required: true},
  driverId: {type: String, maxlength: 64, default: null},
  customerId: {type: String, maxlength: 64, required: true},
  pickupOn: {type: Date, default: null},
  status: {type: String, required: true},
});

TripSchema.index({requestId: 1, driverId: 1, customerId: 1}, {unique: true});

/**
 * Define model
 */
mongoose.model('Trip', TripSchema);
