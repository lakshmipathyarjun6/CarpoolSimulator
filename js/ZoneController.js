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
	this.transferPointOrientations = [];
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

ZoneController.prototype.addTransferPoint = function(tp, orientation) {
	this.transferPoints[tp.id] = tp;
	this.transferPointOrientations[tp.id] = orientation;
};

ZoneController.prototype.getOrientationToTransferPoint = function(tp) {
	return this.transferPointOrientations[tp.id];
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

ZoneController.prototype.findNearestTransferPointWithRiders = function(location) {
	var closest_distance = 1000000000.0;
	var nearest_tp_with_riders;
	for (var tpid in this.transferPoints) {
		var tp = this.transferPoints[tpid];
		var tp_ori = this.transferPointOrientations[tpid];

		var directionVector = new jssim.Vector2D(0, 0);

		directionVector.set(location.x - tp.x, location.y - tp.y);

  		if (directionVector.length() < closest_distance) {
			var riders_at_tp = tp.getRidersAtTransferPoint();

			if (Object.keys(riders_at_tp).length > 0) {
				for(riderId in riders_at_tp) {
					var rider = riders_at_tp[riderId];

					var zone = this.zone;
					var riderGoingInZoneDirection = false;
					switch(tp_ori) {
						case 'nw':
    						riderGoingInZoneDirection = rider.endx >= zone.lbx && rider.endy <= zone.uby;
        					break;
    					case 'ne':
    						riderGoingInZoneDirection = rider.endx <= zone.ubx && rider.endy <= zone.uby;
        					break;
        				case 'sw':
        					riderGoingInZoneDirection = rider.endx >= zone.lbx && rider.endy >= zone.lby;
        					break;
    					default: // se
        					riderGoingInZoneDirection = rider.endx <= zone.ubx && rider.endy >= zone.lby;
					}

					if(riderGoingInZoneDirection) {
						nearest_tp_with_riders = tp;
						closest_distance = directionVector.length();
						break;
					}
					
				}
			}
  		}
	}
	return nearest_tp_with_riders;
}

ZoneController.prototype.remove = function(rider, car) {
	delete this.riderAssignments[rider.id];
	delete this.carAssignments[car.id];
};

ZoneController.prototype.removeRider = function(rider) {
	delete this.riders[rider.id]
};

ZoneController.prototype.pointInZone = function(pointx, pointy) {
	var zone = this.zone;
	var inXBounds = (pointx >= zone.lbx) && (pointx <= zone.ubx);
	var inYBounds = (pointy >= zone.lby) && (pointy <= zone.uby);
	return inXBounds && inYBounds;
}

ZoneController.prototype.getRiderAssignment = function(car) {

	if (typeof this.carAssignments[car.id] === "undefined") {
		var car_dir = car.direction;
		for (var riderId in this.riders) {
			var rider = this.riders[riderId];
			var riderLoc = new jssim.Vector2D(rider.x, rider.y);

			var riderInDirection = false;
			if(car_dir.x < 0 && car_dir.y < 0) {
				riderInDirection = rider.x < car_dir.x && rider.y < car_dir.y;
			}
			else if(car_dir.x < 0 && car_dir.y > 0) {
				riderInDirection = rider.x < car_dir.x && rider.y > car_dir.y;
			}
			else if(car_dir.x > 0 && car_dir.y < 0) {
				riderInDirection = rider.x > car_dir.x && rider.y < car_dir.y;
			}
			else if(car_dir.x > 0 && car_dir.y > 0) {
				riderInDirection = rider.x > car_dir.x && rider.y > car_dir.y;
			}
			else {
				riderInDirection = true;
			}

			if(this.pointInZone(rider.x, rider.y) && !rider.inTransit && !this.isRiderAssigned(rider) && riderInDirection) {
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

