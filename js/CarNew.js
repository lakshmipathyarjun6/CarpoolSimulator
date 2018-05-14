var Car = function(id, city, x, y){
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.size = {x: 10, y: 10};
	this.x = x;
	this.y = y;
	this.numPassengers = 0;
	this.maxCapacity = 4;
	this.zoneController = null;
	this.current_task = {};
	this.riderProfiles = [];
	this.arrivedAtDestination = false;
}
Car.prototype = Object.create(jssim.SimEvent.prototype);

Car.prototype.moveTowards = function(targetVector) {
	var sumVector = new jssim.Vector2D(0, 0);
	var directionVector = new jssim.Vector2D(0, 0);

	var car_location = this.city.getLocation(this.id);

	directionVector.set((targetVector.x - car_location.x) * carSpeed, (targetVector.y - car_location.y) * carSpeed);

	sumVector.addIn(directionVector);
	sumVector.addIn(car_location);

	car_location.x = sumVector.x;
	car_location.y = sumVector.y;

	var errorVector = new jssim.Vector2D(targetVector.x - car_location.x, targetVector.y - car_location.y); 

	if (errorVector.length() < 5) {
		this.arrivedAtDestination = true;
	}
};

Car.prototype.selectNearestDropoffLocation = function() {
	var car_location = this.city.getLocation(this.id);

	//console.log(this.riderProfiles);
	
	function sortWithReferenceDistance(current_car_location) {
		return function compareEndDestinations(ridera,riderb) {
			var ridera_destination_location = this.city.getEndLocation(ridera.id);
			var riderb_destination_location = this.city.getEndLocation(riderb.id);
			var directionVectorA = new jssim.Vector2D(0, 0);
			var directionVectorB = new jssim.Vector2D(0, 0);

			//console.log(ridera);
			//console.log(riderb);

			//var current_car_location = this.city.getLocation(this.id);

			//console.log(this.id);
			//console.log(current_car_location);

			directionVectorA.set(ridera_destination_location.x - current_car_location.x, 
				ridera_destination_location.y - current_car_location.y);
			directionVectorB.set(riderb_destination_location.x - current_car_location.x, 
				riderb_destination_location.y - current_car_location.y);

  			if (directionVectorA.length() < directionVectorB.length())
    			return -1;
  			else if (directionVectorA.length() > directionVectorB.length())
    			return 1;
  			return 0;
		}
	}

	//this.riderProfiles.sort(compareEndDestinations);
	this.riderProfiles.sort(sortWithReferenceDistance(car_location));

	var nearestRiderDropoff = this.riderProfiles[0];
	var nearestLocation;
	if (this.zoneController.pointInZone(nearestRiderDropoff.endx, nearestRiderDropoff.endy)){
		nearestLocation = new jssim.Vector2D(nearestRiderDropoff.endx, nearestRiderDropoff.endy);
	}
	else {
		var zone = this.zoneController.getZone();
		var tps = this.zoneController.getTransferPoints();
		var target_tp;
		if (nearestRiderDropoff.endx > zone.ubx && nearestRiderDropoff.endy > zone.uby) {
			for (rider of this.riderProfiles) {
				if(rider.endx > zone.ubx || rider.endy > zone.uby) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.x >= zone.ubx && tp.y >= zone.uby) {
					target_tp = tp;
					break;
				}
			}
		}
		else {
			for (rider of this.riderProfiles) {
				if(rider.endx < zone.lbx && rider.endy < zone.lby) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.x <= zone.lbx && tp.y <= zone.lby) {
					target_tp = tp;
					break;
				}
			}
		}
		nearestLocation = target_tp;
	}
	nearestRiderDropoff.designateAsDroppingOffNext();
	return nearestLocation;
}

Car.prototype.pickUpRider = function(rider) {
	this.numPassengers++;
	rider.carAssignment = this.id;
	rider.inTransit = true;
	this.riderProfiles.push(rider);
	this.arrivedAtDestination = false;
	this.zoneController.remove(rider, this);
};

Car.prototype.pickUpRidersAtTP = function(tp) {
	var ridersAtTP = tp.getRidersAtTransferPoint();
	for (var riderId in ridersAtTP) {
		var rider = ridersAtTP[riderId];
		if(rider.priorZoneId != this.zoneController.id && this.numPassengers < this.maxCapacity / 2) {
			this.pickUpRider(rider);
			this.zoneController.addRider(rider);
			tp.loseOutboundRider(rider);
		}
	}
}

Car.prototype.dropOffRidersAtDestination = function(destination) {
	var newCurrentRidersList = [];
	var toWipe = [];
	var exhangeAtTP = false;
	for (rider of this.riderProfiles) {
		if (rider.selectedToDropOff) {
			rider.inTransit = false;
			rider.selectedToDropOff = false;
			if (destination instanceof TransferPoint) { // transfer point
				rider.hopOffAtTransferPoint(destination, this.zoneController.id);
				exhangeAtTP = true;
			}
			else { 
				toWipe.push(rider);
			}
			this.zoneController.removeRider(rider);
			this.numPassengers--;
		}
		else {
			newCurrentRidersList.push(rider);
		}
	}
	for (rider of toWipe) {
		rider.destroy();
	}
	this.riderProfiles = newCurrentRidersList;
	this.numPassengers = this.riderProfiles.length;
	this.arrivedAtDestination = false;

	if(exhangeAtTP) {
		this.pickUpRidersAtTP(destination);
	}
};

Car.prototype.update = function(deltaTime) {
	var arg;
	var next_rider = this.zoneController.getRiderAssignment(this);
	if (next_rider && this.numPassengers < this.maxCapacity) {
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			var targetVector = new jssim.Vector2D(next_rider.x, next_rider.y);
			arg = targetVector;
		}
		else {
			this.current_task = this.pickUpRider;
			arg = next_rider;
		}
	}
	else if(this.numPassengers == this.maxCapacity) {
		var nextDropoffLocation = this.selectNearestDropoffLocation();
		var isTransferPoint = nextDropoffLocation instanceof TransferPoint;
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			if(isTransferPoint) {
				nextDropoffLocation = new jssim.Vector2D(nextDropoffLocation.x, nextDropoffLocation.y);
			}
		}
		else{
			this.current_task = this.dropOffRidersAtDestination;
		}
		arg = nextDropoffLocation;
	}
	else {
		this.current_task = this.moveTowards;
		var tps = this.zoneController.getTransferPoints();
		var tpsIndices = Object.keys(tps);
		var goalTPIndex = Math.floor(scheduler.current_time / 20) % tpsIndices.length;
		var targetZone = tps[tpsIndices[goalTPIndex]];
		var targetVector = new jssim.Vector2D(targetZone.x, targetZone.y);
		arg = targetVector;
	}
	this.current_task(arg);
};


