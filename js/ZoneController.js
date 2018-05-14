var Zone = function(lbx, lby, ubx, uby) {
	this.lbx = lbx;
	this.lby = lby;
	this.ubx = ubx;
	this.uby = uby;
}

var ZoneController = function(id, city, zone) {
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.zone = zone;
	this.transferPoints = [];
	this.cars = [];
	this.riders = [];
	this.riderAssignments = [];
	this.carAssignments = [];
}
ZoneController.prototype = Object.create(jssim.SimEvent.prototype);

ZoneController.prototype.update = function(deltaTime) {};

ZoneController.prototype.assignCar = function(car) {
	this.cars[car.id] = car;
	car.zoneController = this;
};

ZoneController.prototype.addTransferPoint = function(tp) {
	this.transferPoints[tp.id] = tp;
};

ZoneController.prototype.addRider = function(rider) {
	this.riders[rider.id] = rider;
};

ZoneController.prototype.assign = function(rider, car) {
	this.riderAssignments[rider.id] = car.id;
	this.carAssignments[car.id] = rider.id;
};

ZoneController.prototype.isRiderAssigned = function(rider) {
	if(rider.id in this.riderAssignments) {
		return true;
	}
	return false;
};

ZoneController.prototype.remove = function(rider, car) {
	delete this.riderAssignments[rider.id];
	delete this.carAssignments[car.id];
};

ZoneController.prototype.removeRider = function(rider) {
	delete this.riders[rider.id]
};

ZoneController.prototype.pointInZone = function(pointx, pointy) {
	var zone = this.zone;
	var inXBounds = (pointx > zone.lbx) && (pointx < zone.ubx);
	var inYBounds = (pointy > zone.lby) && (pointy < zone.uby);
	return inXBounds && inYBounds;
}

ZoneController.prototype.getRiderAssignment = function(car) {

	if (typeof this.carAssignments[car.id] === "undefined") {
		for (var riderId in this.riders) {
			var rider = this.riders[riderId];
			if(this.pointInZone(rider.x, rider.y) && !rider.inTransit && !this.isRiderAssigned(rider)) {
				this.assign(rider, car);
				break;
			}
		}
	}

	var riderId = this.carAssignments[car.id];
	return this.riders[riderId];
};

ZoneController.prototype.getTransferPoints = function() {
	return this.transferPoints;
}

ZoneController.prototype.getZone = function() {
	return this.zone;
}

