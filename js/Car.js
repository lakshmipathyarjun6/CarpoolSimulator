var Car = function(id, city, x, y, zonetps, assignedzone){
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.size = {x: 10, y: 10};
	this.x = x;
	this.y = y;
	this.numPassengers = 0;
	this.maxCapacity = 2;
	this.zonetps = zonetps;
	this.assignedZone = assignedzone;
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

	if (errorVector.length() < 3) {
		this.arrivedAtDestination = true;
	}
};

Car.prototype.pointInZone = function(pointx, pointy) {
	var zone = zones[this.assignedZone];
	var inXBounds = (pointx > zone.lbx) && (pointx < zone.ubx);
	var inYBounds = (pointy > zone.lby) && (pointy < zone.uby);
	return inXBounds && inYBounds;
}

Car.prototype.selectNearestDropoffLocation = function() {
	var car_location = this.city.getLocation(this.id);
	
	function compareEndDestinations(ridera,riderb) {
		var ridera_destination_location = this.city.getEndLocation(ridera.id);
		var riderb_destination_location = this.city.getEndLocation(riderb.id);
		var directionVectorA = new jssim.Vector2D(0, 0);
		var directionVectorB = new jssim.Vector2D(0, 0);

		directionVectorA.set(ridera_destination_location.x - car_location.x, 
			ridera_destination_location.y - car_location.y);
		directionVectorB.set(riderb_destination_location.x - car_location.x, 
			riderb_destination_location.y - car_location.y);

  		if (directionVectorA.length() < directionVectorB.length())
    		return -1;
  		else if (directionVectorA.length() > directionVectorB.length())
    		return 1;
  		return 0;
	}

	this.riderProfiles.sort(compareEndDestinations);

	var nearestRiderDropoff = this.riderProfiles[0];
	var nearestLocation;
	if (this.pointInZone(nearestRiderDropoff.endx, nearestRiderDropoff.endy)){
		nearestLocation = new jssim.Vector2D(nearestRiderDropoff.endx, nearestRiderDropoff.endy);
	}
	else {
		var zone = zones[this.assignedZone];
		var tp;
		if (nearestRiderDropoff.endx > zone.ubx || nearestRiderDropoff.endy > zone.uby) {
			for (rider of this.riderProfiles) {
				if(rider.endx > zone.ubx || rider.endy > zone.uby) {
					rider.designateAsDroppingOffNext();
				}
			}
			//console.log('car: ' + this.id + 'z1');
			//console.log(this.zonetps[1].id);
			tp = this.zonetps[1];
		}
		else {
			for (rider of this.riderProfiles) {
				if(rider.endx < zone.lbx || rider.endy < zone.lby) {
					rider.designateAsDroppingOffNext();
				}
			}
			//console.log('car: ' + this.id + 'z0');
			//console.log(this.zonetps[0].id);
			tp = this.zonetps[0];
		}
		nearestLocation = tp;
	}
	nearestRiderDropoff.designateAsDroppingOffNext();
	return nearestLocation;
}

Car.prototype.findRidersInZone = function() {
	var riders = [];
	var agents = city.findAllAgents();
	var allRiderIds = Object.keys(agents).filter(v => /^r/.test(v));

	for (riderId of allRiderIds) {
		var rider = agents[riderId];

		if(this.pointInZone(rider.x, rider.y) && !rider.inTransit) {
			riders.push(rider);
		}
	}
	return riders;
};

Car.prototype.pickUpRider = function(rider) {
	this.numPassengers++;
	rider.carAssignment = this.id;
	rider.inTransit = true;
	this.riderProfiles.push(rider);
	this.arrivedAtDestination = false;
};

Car.prototype.pickUpRidersAtTP = function(tp) {
	var ridersAtTP = tp.getRidersAtTransferPoint();
	console.log('Transfer point: ' + tp.id);
	console.log(ridersAtTP);
	for (var riderId in ridersAtTP) {
		var rider = ridersAtTP[riderId];
		if(rider.priorZoneId != this.assignedZone && this.numPassengers < this.maxCapacity / 2) {
			this.pickUpRider(rider);
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
				rider.hopOffAtTransferPoint(destination, this.assignedZone);
				exhangeAtTP = true;
			}
			else { 
				toWipe.push(rider);
			}
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
	var waiting_riders = this.findRidersInZone();
	if (waiting_riders.length > 0 && this.numPassengers < this.maxCapacity) {
		var targetRider = waiting_riders[0];
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			var targetVector = new jssim.Vector2D(targetRider.x, targetRider.y);
			arg = targetVector;
		}
		else {
			this.current_task = this.pickUpRider;
			arg = targetRider;
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
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			var goalTPIndex = Math.floor(scheduler.current_time / 20) % 2;
			var targetZone = this.zonetps[goalTPIndex];
			var targetVector = new jssim.Vector2D(targetZone.x, targetZone.y);
			arg = targetVector;
		}
		else {
			console.log('Arrived at tp');
		}
	}
	console.log(this.numPassengers);
	this.current_task(arg);
};


