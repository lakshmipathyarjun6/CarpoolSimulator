var Metrics = function(id, city, nc) {
	jssim.SimEvent.call(this);
	this.id = id;
	this.city = city;
	this.num_cars = nc;
	this.avgRiders = 0.0;
}
Metrics.prototype = Object.create(jssim.SimEvent.prototype);

Metrics.prototype.update = function(deltaTime) {
	var totalPassengers = 0;
	var agents = this.city.findAllAgents();
	for(var i=1; i < this.num_cars+1; i++) {
		var car = agents['c'+String(i)];
		totalPassengers += car.numPassengers;
	}
	this.avgRiders = totalPassengers / num_cars;
};