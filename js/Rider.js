var Rider = function(id, city, startx, starty, endx, endy){
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.size = {x: 5, y: 5};
	this.x = startx;
	this.y = starty;
   	this.endx = endx;
	this.endy = endy;
	this.tripStart = null;
 	this.inTransit = false;
 	this.carAssignment = null;
 	this.selectedToDropOff = false;
}
Rider.prototype = Object.create(jssim.SimEvent.prototype);

Rider.prototype.update = function(deltaTime) {
	var rider_location = this.city.getLocation(this.id);
	if (this.inTransit) {
		var car_location = this.city.getLocation(this.carAssignment);
		rider_location.x = car_location.x;
		rider_location.y = car_location.y;
		this.x = car_location.x;
		this.y = car_location.y;
	}
};

Rider.prototype.designateAsDroppingOffNext = function() {
	this.selectedToDropOff = true;
}

Rider.prototype.hopOffAtTransferPoint = function(tp) {
	var rider_location = this.city.getLocation(this.id);
	rider_location.x = tp.x;
	rider_location.y = tp.y;
	this.x = tp.x;
	this.y = tp.y;
	this.carAssignment = null;
	tp.receiveInboundRider(this);
}

Rider.prototype.destroy = function() {
	delete this.city.deleteAgent(this);
}