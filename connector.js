/**
 * Network connector
 */

var net = require('net');
var tls = require('tls');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Connector = function(host, port, ssl=false, encoding="utf-8") {
	var _encoding = encoding;
	if(!ssl) {
		this.socket = net.connect(port, host, function() {
			this.emit('socket.connected', host, port);
		});
	} else {
		this.socket = tls.connect(port, host, function() {
			this.emit('socket.connected', host, port);
			this.emit('socket.secured', this.socket.authorized);
		});
	}
	this.socket.setEncoding(_encoding);

	this.socket.on('data', function(data) {
		this.emit('socket.receive', data);
	});
	this.socket.on('end', function() {
		this.emit('socket.endreceive');
	});
	this.socket.on('close', function(had_error) {
		this.emit('socket.closed', had_error);
	});
	this.socket.on('error', function(err) {
		this.emit('socket.error', err);
	});

	this.close = function() {
		this.socket.close();
	};
	this.send = function(data, callback) {
		this.socket.write(data, _encoding, function() {
			this.emit('socket.written', data.length);
			callback();
		});
	};
};

util.inherits(Connector, EventEmitter);

module.exports.Connector = Connector;
