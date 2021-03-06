var amqp = require('amqp');

var connection = amqp.createConnection({
	host : '127.0.0.1'
});
var rpc = new (require('./amqprpc'))(connection);

// make request to rabbitMQ
function make_request(queue_name, msg_payload, callback) {
	rpc.makeRequest(queue_name, msg_payload, function(err, response) {
		if (err)
			console.error(err);
		else {
//			console.log("response in client.js", response);
			console.log("response in client.js");
			callback(null, response);
		}
	});
}

exports.make_request = make_request;
