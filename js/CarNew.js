var Car = function(id, city, x, y){
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.size = {x: 10, y: 10};
	this.x = x;
	this.y = y;
	this.prevx = x;
	this.prevy = y;
	this.direction = new jssim.Vector2D(0,0);
	this.numPassengers = 0;
	this.maxCapacity = 4;
	this.zoneController = null;
	this.current_task = {};
	this.riderProfiles = [];
	this.arrivedAtDestination = false;
	this.currentRandomTarget = null;
}
Car.prototype = Object.create(jssim.SimEvent.prototype);

Car.prototype.moveTowards = function(targetVector) {
	var sumVector = new jssim.Vector2D(0, 0);
	var directionVector = new jssim.Vector2D(0, 0);

	var car_location = this.city.getLocation(this.id);

	if (typeof car_location === "undefined" || typeof targetVector === "undefined") {
		console.log(this);
		console.log(car_location);
		console.log(targetVector);
	}
	directionVector.set((targetVector.x - car_location.x) * carSpeed, (targetVector.y - car_location.y) * carSpeed);

	sumVector.addIn(directionVector);
	sumVector.addIn(car_location);

	car_location.x = sumVector.x;
	car_location.y = sumVector.y;

	this.x = car_location.x;
	this.y = car_location.y;

	var errorVector = new jssim.Vector2D(targetVector.x - car_location.x, targetVector.y - car_location.y); 

	if (errorVector.length() < 5) {
		this.arrivedAtDestination = true;
	}
};

Car.prototype.selectNearestDropoffLocation = function() {
	var car_location = this.city.getLocation(this.id);
	
	function sortWithReferenceDistance(current_car_location) {
		return function compareEndDestinations(ridera,riderb) {
			var ridera_destination_location = this.city.getEndLocation(ridera.id);
			var riderb_destination_location = this.city.getEndLocation(riderb.id);
			var directionVectorA = new jssim.Vector2D(0, 0);
			var directionVectorB = new jssim.Vector2D(0, 0);

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

	this.riderProfiles.sort(sortWithReferenceDistance(car_location));

	var nearestRiderDropoff = this.riderProfiles[0];
	var nearestLocation;
	if (this.zoneController.pointInZone(nearestRiderDropoff.endx, nearestRiderDropoff.endy)){
		nearestLocation = new jssim.Vector2D(nearestRiderDropoff.endx, nearestRiderDropoff.endy);
	}
	else {
		var zone = this.zoneController.getZone();
		var tps = this.zoneController.getTransferPoints();
		var cardinalDirection = false;
		var possible_tp_options = [];
		var target_tp;
		if (nearestRiderDropoff.endx >= zone.ubx && nearestRiderDropoff.endy >= zone.uby) { // ne
			for (rider of this.riderProfiles) {
				if(rider.endx >= zone.ubx && rider.endy >= zone.uby) {
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
		else if(nearestRiderDropoff.endx >= zone.ubx && nearestRiderDropoff.endy <= zone.lby) { // se
			for (rider of this.riderProfiles) {
				if(rider.endx >= zone.ubx && rider.endy <= zone.lby) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.x >= zone.ubx && tp.y <= zone.lby) {
					target_tp = tp;
					break;
				}
			}
		}
		else if(nearestRiderDropoff.endx <= zone.lbx && nearestRiderDropoff.endy >= zone.uby) { // nw
			for (rider of this.riderProfiles) {
				if(rider.endx <= zone.lbx && rider.endy >= zone.uby) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.x <= zone.lbx && tp.y >= zone.uby) {
					target_tp = tp;
					break;
				}
			}
		}
		else if(nearestRiderDropoff.endx <= zone.lbx && nearestRiderDropoff.endy <= zone.lby) { // sw
			for (rider of this.riderProfiles) {
				if(rider.endx <= zone.lbx && rider.endy <= zone.lby) { 
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
		else if(nearestRiderDropoff.endy >= zone.uby) { // n
			cardinalDirection = true;
			for (rider of this.riderProfiles) {
				if(rider.endy >= zone.uby) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.y >= zone.uby) { // there should be 2 that meet this condition
					possible_tp_options.push(tp);
				}
			}
		}
		else if(nearestRiderDropoff.endx >= zone.ubx) { // e
			cardinalDirection = true;
			for (rider of this.riderProfiles) {
				if(rider.endx >= zone.ubx) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.x >= zone.ubx) { // there should be 2 that meet this condition
					possible_tp_options.push(tp);
				}
			}
		}
		else if(nearestRiderDropoff.endy <= zone.lby) { // s
			cardinalDirection = true;
			for (rider of this.riderProfiles) {
				if(rider.endy <= zone.lby) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.y <= zone.lby) { // there should be 2 that meet this condition
					possible_tp_options.push(tp);
				}
			}
		}
		else { // w
			cardinalDirection = true;
			for (rider of this.riderProfiles) {
				if(rider.endx <= zone.lbx) {
					rider.designateAsDroppingOffNext();
				}
			}
			for (var tpid in tps) {
				var tp = tps[tpid];
				if (tp.x <= zone.lbx) { // there should be 2 that meet this condition
					possible_tp_options.push(tp);
				}
			}
		}

		if(cardinalDirection) {
			var tp1 = possible_tp_options[0];
			var tp2 = possible_tp_options[1];
			var directionVectorA = new jssim.Vector2D(0, 0);
			var directionVectorB = new jssim.Vector2D(0, 0);

			directionVectorA.set(tp1.x - this.x, tp1.y - this.y);
			directionVectorB.set(tp2.x - this.x, tp2.y - this.y);

			target_tp = (directionVectorA.length() < directionVectorB.length()) ? tp1 : tp2;
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

Car.prototype.pickUpRidersAtTP = function(tp, capacity_override) {
	var ridersAtTP = tp.getRidersAtTransferPoint();
	for (var riderId in ridersAtTP) {
		var rider = ridersAtTP[riderId];

		var riderGoingInZoneDirection = false;
		var zcori = this.zoneController.getOrientationToTransferPoint(tp);
		var zone = this.zoneController.getZone();
		switch(zcori) {
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

		//var upper_limit = (capacity_override) ? this.maxCapacity : this.maxCapacity / 2; 
		var upper_limit = this.maxCapacity;

		if(riderGoingInZoneDirection && this.numPassengers < upper_limit) {
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
				rider.hopOffAtTransferPoint(destination);
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
		var metrics = this.city.getAgent('m');
		metrics.addCompletedTrip();
		rider.destroy();
	}
	this.riderProfiles = newCurrentRidersList;
	this.numPassengers = this.riderProfiles.length;
	this.arrivedAtDestination = false;

	if(exhangeAtTP) {
		this.pickUpRidersAtTP(destination, false);
	}
}

Car.prototype.pickUpRiderAtTPWithOverride = function(tp) {
	this.arrivedAtDestination = false;
	this.pickUpRidersAtTP(tp, true);
}

Car.prototype.doNothing = function(anything) {
	this.arrivedAtDestination = false;
	this.currentRandomTarget = null;
}

Car.prototype.update = function(deltaTime) {
	var arg;
	var next_rider = this.zoneController.getRiderAssignment(this);
	var next_tp = this.zoneController.findNearestTransferPointWithRiders(new jssim.Vector2D(this.x, this.y));
	if (next_rider && this.numPassengers < this.maxCapacity) {
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			var targetVector = new jssim.Vector2D(next_rider.x, next_rider.y);
			arg = targetVector;
		}
		else {
			this.arrivedAtDestination = false;
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
			this.arrivedAtDestination = false;
			this.current_task = this.dropOffRidersAtDestination;
		}
		arg = nextDropoffLocation;
	}
	else if(this.numPassengers >= 1) {
		var nextDropoffLocation = this.selectNearestDropoffLocation();
		var isTransferPoint = nextDropoffLocation instanceof TransferPoint;
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			if(isTransferPoint) {
				nextDropoffLocation = new jssim.Vector2D(nextDropoffLocation.x, nextDropoffLocation.y);
			}
		}
		else{
			this.arrivedAtDestination = false;
			this.current_task = this.dropOffRidersAtDestination;
		}
		arg = nextDropoffLocation;
	}
	else if(next_tp) {
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			var targetVector = new jssim.Vector2D(next_tp.x, next_tp.y);
			arg = targetVector;
		}
		else {
			this.arrivedAtDestination = false;
			this.current_task = this.pickUpRiderAtTPWithOverride;
			arg = next_tp;
		}
	}
	else {
		if(this.currentRandomTarget == null) {
			var zone = this.zoneController.getZone();
			var randomNumberZoneEndpoint = Math.floor(Math.random() * 4);
			switch(randomNumberZoneEndpoint) {
    			case 0:
    				xloc = zone.lbx;
    				yloc = zone.lby;
        			break;
    			case 1:
    				xloc = zone.lbx;
    				yloc = zone.uby;
        			break;
        		case 2:
        			xloc = zone.ubx;
    				yloc = zone.uby;
        			break;
    			default:
        			xloc = zone.ubx;
    				yloc = zone.lby;
			}
			this.currentRandomTarget = new jssim.Vector2D(xloc, yloc);
		}

		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			arg = this.currentRandomTarget;
		}
		else {
			this.current_task = this.doNothing;
			arg = null;
		}
	}
	this.direction.set(this.x - this.prevx, this.y - this.prevy);
	this.prevx = this.x;
	this.prevy = this.y;
	this.current_task(arg);
};


