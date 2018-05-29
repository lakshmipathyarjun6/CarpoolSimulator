var Metrics = function(id, city, nc) {
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.num_cars = nc;
	this.avgRiders = 0.0;
	this.completedTrips = 0;
	this.avgCollectedFare = 0;
	this.averageTotalWaitTime = 0;
	this.collectedFares = [];
	this.riderWaitTimes = [];
}
Metrics.prototype = Object.create(jssim.SimEvent.prototype);

Metrics.prototype.update = function(deltaTime) {
	var totalPassengers = 0;
	var totalFare = 0;
	var agents = this.city.findAllAgents();
	this.collectedFares = [];
	for(var i=1; i < this.num_cars+1; i++) {
		var car = agents['c'+String(i)];
		totalPassengers += car.numPassengers;
		totalFare += car.earnings;
		this.collectedFares.push(car.earnings);
	}
	this.avgRiders = totalPassengers / num_cars;
	this.avgCollectedFare = totalFare / num_cars;
	if(this.riderWaitTimes.length > 0) {
		var grandTotal = 0;
		for(time of this.riderWaitTimes) {
			grandTotal += time;
		}
		this.averageTotalWaitTime = grandTotal / this.completedTrips;
	}
};

Metrics.prototype.addCompletedTrip = function() {
	this.completedTrips++;
};

Metrics.prototype.addTotalWaitTime = function(waitTime) {
	this.riderWaitTimes.push(waitTime);
};