/*var scheduler = new jssim.Scheduler();
var city = new jssim.Space2D();
var num_tps = 3;
var num_zcs = 4;
var num_cars_per_zone = 4;
var num_cars = num_zcs * num_cars_per_zone;
var num_riders = 0;
var carSpeed = 0.2;
var rider_probability = 80;
city.width = 1180;
city.height = 980;*/

var scheduler = new jssim.Scheduler();
var city = new jssim.Space2D();
var num_tps = 21;
var num_zcs = 16;
var num_cars_per_zone = 4;
var num_cars = num_zcs * num_cars_per_zone;
var num_riders = 0;
var carSpeed = 0.2;
var rider_probability = 80;
city.width = 1180;
city.height = 980;
var flat_rate = 2;
var per_unit_distance_rate = 0.05;
var concentratedRiderSpawn = true;

var num_extra_cars_in_train_station_zone = (concentratedRiderSpawn) ? 2 : 0;
var num_extra_cars_in_ferry_terminal_zone = (concentratedRiderSpawn) ? 2 : 0;
var num_extra_cars_in_airport_zone = (concentratedRiderSpawn) ? 2 : 0;
num_cars += num_extra_cars_in_train_station_zone;
num_cars += num_extra_cars_in_ferry_terminal_zone;
num_cars += num_extra_cars_in_airport_zone;

var trainStation = {
	x: 2*250+20+100,
	y: 1*220+50+100,
	zc: 'zc23'
};
var airport = {
	x: 3*250+20+100,
	y: 3*220+50+100,
	zc: 'zc44'
};
var ferryTerminal = {
	x: 0*250+20+100,
	y: 2*220+50+100,
	zc: 'zc31'
};