var scheduler = new jssim.Scheduler();
var city = new jssim.Space2D();
var num_tps = 5;
var num_zones = 4;
var num_cars = 4;
var num_riders = 0;
var carSpeed = 0.1;
var rider_probability = 50;
city.width = 1180;
city.height = 980;

var zones = [];