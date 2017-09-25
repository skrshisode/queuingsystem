'use strict';

/**
 * Dependencies
 */
const amqp = require('amqplib');
const EventEmitter = require('events').EventEmitter;

class Broker extends EventEmitter {
  constructor(url, options) {
    options = options || {};

    url = url || 'amqp://root:root@localhost:5672';
    super();

    this.connection = null;
    this.channel = null;
    this.queue = null;
    this.consumer = null;
    this.ex = options.exchange || 'trips';

    amqp
      .connect(url)
      .then(this.createChannel.bind(this))
      .then(this.onChannel.bind(this))
      .catch(this.onConnectionErr.bind(this));
  }

  createChannel(connection) {
    this.connection = connection;
    this.connection.once('close', this.onClose.bind(this));
    return connection.createChannel();
  }

  onChannel(channel) {
    this.channel = channel;
    this.channel.assertExchange(
      this.ex,
      'fanout',
      {durable: false}
    ).then(() => {
      const self = this;
      this.channel.assertQueue('', {exclusive: true})
        .then((q) => {
          return self.channel.bindQueue(q.queue, 'trips', '').then(() => {
            return q.queue;
          });
        })
        .then((queue) => {
          self.consumer = new EventEmitter();
          self.channel.consume(queue, (message) => {
            self.consumer.emit(self.ex, message.content.toString());
          }, {noAck: true});
        });
      this.emit('connected');
    });
    this.channel.on('close', this.onChannelClose.bind(this));
  }

  publish(message) {
    this.channel.publish(this.ex, '', new Buffer(JSON.stringify(message)));
  }

  close() {
    this.connection.close();
  }

  onClose() {
    this.emit('disconnected');
  }

  onConnectionErr(err) {
    console.log(err);
    this.emit('disconnected', err);
  }

  onChannelClose() {
    this.emit('disconnected');
  }
}

module.exports = (url, options) => {
  return new Broker(url, options);
};
