var TransferPoint = function(id, city, x, y) {
	jssim.SimEvent.call(this);
	this.id = id;
	this.size = {x: 15, y: 15};
	this.city = city;
	this.x = x;
 	this.y = y;
 	this.ridersAtTp = [];
 	this.cumWaitTime = 0;
}
TransferPoint.prototype = Object.create(jssim.SimEvent.prototype);

TransferPoint.prototype.update = function(deltaTime) {
	this.cumWaitTime += this.ridersAtTp.length;
};

TransferPoint.prototype.receiveInboundRider = function(rider) {
	this.ridersAtTp[rider.id] = rider;
};

TransferPoint.prototype.getRidersAtTransferPoint = function() {
	return this.ridersAtTp;
}

TransferPoint.prototype.loseOutboundRider = function(rider) {
	var index = this.ridersAtTp.indexOf(rider.id);
	if (index > -1) {
  		this.ridersAtTp.splice(index, 1);
	}
};
