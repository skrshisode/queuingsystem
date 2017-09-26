/*global broker*/
'use strict';

/**
* Dependencies
*/
const mw = require('../helpers/mw-util');
const mongoose = require('mongoose');
const uuid = require('uuid/v1');

/**
 * Models
 */
const Trip = mongoose.model('Trip');

const tripsCtrl = {
  request(req, res) {
    const body = req.swagger.params.body.value;
    const trip = new Trip({
      createdOn: Date.now(),
      requestId: uuid(),
      customerId: body.customerId,
      status: 'waiting',
    });

    trip
      .save()
      .then((trip) => {
        broker.publish(trip);
        return res.status(200).json({
          'message': 'Successfully added',
        });
      });
  },
  listAll(req, res) {
    const driverId = req.swagger.params.driverId.value;
    const status = req.swagger.params.status.value;

    const size = req.swagger.params.size.value;
    const page = (req.swagger.params.page.value - 1) * size;

    let query = {};
    if (status) {
      query.status = status;
    }

    if (status !== 'waiting' && driverId) {
      query.driverId = driverId;
    }

    Trip.find(query)
    .select({
      'deletedOn': 0,
      '_id': 0,
    })
    .sort({'updatedOn': -1})
    .limit(size)
    .skip(page)
    .exec()
    .then((trips) => {
      return res.status(200).json({
        'data': trips,
      });
    });
  },
  assign(req, res) {
    const requestId = req.swagger.params.requestId.value;
    const driverId = req.swagger.params.driverId.value;
    const body = req.swagger.params.body.value;

    let query = {
          requestId: requestId,
          status: 'waiting',
        },
        update = {
          updatedOn: Date.now(),
          status: 'ongoing',
          pickupOn: Date.now(),
          driverId: driverId,
        },
        options = {
          new: true,
        };

    if (body.action === 'dropoff') {
      // In case of dropoff

      // change the query to ensure only assigned driver is dropping the customer
      query.status = 'ongoing';
      query.driverId = driverId;

      // Only update the status
      update.status = 'completed';
      delete update.pickupOn;
      delete update.driverId;
    }

    Trip.findOneAndUpdate(query, update, options)
        .exec()
        .then(function(trip) {
          if (trip) {
            broker.publish(trip);
            return res.status(200).json({
              'message': body.action === 'dropoff' ?
                         'Successfully dropped' : 'Successfully assigned',
            });
          }
          else {
            return res.status(400).json({
              'message': body.action === 'dropoff' ?
              'Already dropped' + ' or ' +
              'Not picked up yet' + ' or ' +
              'Wrong driver' : 'Already assigned',
            });
          }
        });
  },
};

module.exports = {
  'listAll': mw([
    tripsCtrl.listAll,
  ]),
  'request': mw([
    tripsCtrl.request,
  ]),
  'assign': mw([
    tripsCtrl.assign,
  ]),
};
