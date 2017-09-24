'use strict';

/**
* Dependencies
*/
const mw = require('../helpers/mw-util');

const tripsCtrl = {
  listAll(req, res) {
    const size = req.swagger.params.size.value;
    const page = (req.swagger.params.page.value - 1) * size;
    console.log(page, size);
    return res.status(200).json({
      data: 'listResponse',
    });
  },
  request(req, res) {
    const body = req.swagger.params.body.value;
    console.log(body.customer_id);
    return res.status(200).json({
      data: 'requestResponse',
    });
  },
  assign(req, res) {
    const requestId = req.swagger.params.request_id.value;
    const body = req.swagger.params.body.value;
    console.log(requestId);
    console.log(body.driver_id);
    return res.status(200).json({
      data: 'assignResponse',
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
