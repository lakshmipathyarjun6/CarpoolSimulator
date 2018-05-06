var TransferPoint = function(id, city, x, y) {
	jssim.SimEvent.call(this);
	this.id = id;
	this.size = {x: 15, y: 15};
	this.city = city;
	this.x = x;
 	this.y = y;
}
TransferPoint.prototype = Object.create(jssim.SimEvent.prototype);

TransferPoint.prototype.update = function(deltaTime) {};