/*var Car = function(id, city, x, y, zonetps, assignedzone){
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.size = {x: 10, y: 10};
	this.x = x;
	this.y = y;
	this.numPassengers = 0;
	this.maxCapacity = 4;
	this.zonetps = zonetps;
	this.assignedZone = assignedzone;
	this.current_task = {};
	this.arrivedAtDestination = false;
}
Car.prototype = Object.create(jssim.SimEvent.prototype);

Car.prototype.moveTowards = function(agent) {
	var sumVector = new jssim.Vector2D(0, 0);
	var directionVector = new jssim.Vector2D(0, 0);

	var car_location = this.city.getLocation(this.id);

	directionVector.set((agent.x - car_location.x) * carSpeed, (agent.y - car_location.y) * carSpeed);

	sumVector.addIn(directionVector);
	sumVector.addIn(car_location);

	car_location.x = sumVector.x;
	car_location.y = sumVector.y;

	if (Math.abs(car_location.x - agent.x) < 0.01) {
		this.arrivedAtDestination = true;
	}
};

Car.prototype.pickUpRider = function(rider) {
	this.numPassengers += 1;
	rider.carAssignment = this.id;
	rider.inTransit = true;
	this.arrivedAtDestination = false;
};

Car.prototype.update = function(deltaTime) {
	var waiting_riders = this.findRidersInZone();
	if (waiting_riders.length > 0 && this.numPassengers < this.maxCapacity) {
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			arg = waiting_riders[0];
		}
		else {
			this.current_task = this.pickUpRider;
			console.log('Arrived at rider');
		}
	}
	else {
		if (!this.arrivedAtDestination) {
			this.current_task = this.moveTowards;
			var goalTPIndex = Math.floor(scheduler.current_time / 20) % 2;
			arg = this.zonetps[goalTPIndex];
		}
		else {
			console.log('Arrived at tp');
		}
	}
	this.current_task(arg);
};*/