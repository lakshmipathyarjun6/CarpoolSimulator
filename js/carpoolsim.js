(function(){

               	function reset() {
                    scheduler.reset();
               		city.reset();
                }

                function createTPs() {
                	for(var i=0; i < num_tps; i++) {
                   		var tp = new TransferPoint('tp'+String(i+1), city, i*250+20, i*220+50);
                   		var r = Math.floor(Math.random() * 255);
                   		var g = Math.floor(Math.random() * 255);
                   		var b = Math.floor(Math.random() * 255);
                   		tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
                   		city.updateAgent(tp, tp.x, tp.y);
                   		scheduler.scheduleRepeatingIn(tp, 1);
               		}

               		var agents = city.findAllAgents();
               		for(var i=1; i < num_tps+1; i++) {
               			if(i > 1){
               				city.drawLine(agents['tp'+String(i-1)].x,agents['tp'+String(i-1)].y,agents['tp'+String(i-1)].x,agents['tp'+String(i)].y);
               				city.drawLine(agents['tp'+String(i-1)].x,agents['tp'+String(i)].y,agents['tp'+String(i)].x,agents['tp'+String(i)].y);

               				city.drawLine(agents['tp'+String(i-1)].x,agents['tp'+String(i-1)].y,agents['tp'+String(i)].x,agents['tp'+String(i-1)].y);
               				city.drawLine(agents['tp'+String(i)].x,agents['tp'+String(i-1)].y,agents['tp'+String(i)].x,agents['tp'+String(i)].y);

               				var zone = new Zone('z'+String(i-1), agents['tp'+String(i-1)].x, agents['tp'+String(i-1)].y, agents['tp'+String(i)].x,agents['tp'+String(i)].y);
               				zones[zone.id] = zone;
               			}
               		}
                }

                function createCars() {
                	var agents = city.findAllAgents();
                	for(var i=1; i < num_cars+1; i++) {
               			var ztp1 = agents['tp'+String(i)];
               			var ztp2 = agents['tp'+String(i+1)];
                   		var car = new Car('c'+String(i), city, 0.5*(ztp1.x + ztp2.x), 
                   			0.5*(ztp1.y + ztp2.y), [ztp1, ztp2], 'z'+String(i));
                   		var r = Math.floor(Math.random() * 255);
                   		var g = Math.floor(Math.random() * 255);
                   		var b = Math.floor(Math.random() * 255);
                   		car.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
                   		city.updateAgent(car, car.x, car.y);
                   		scheduler.scheduleRepeatingIn(car, 1);
               		}
                }

                function createMetrics() {
                	var metrics = new Metrics('m', city, num_cars);
                	city.agents[metrics.id] = metrics;
                   	scheduler.scheduleRepeatingIn(metrics, 1);
                }

                function maybeSpawnRidersRandom() {
                	var willGenerateRider = Math.floor(Math.random() * 100) < rider_probability;
                	if (willGenerateRider) {
                		var start_zone = zones['z'+String(Math.floor(Math.random() * 4) + 1)];
                		var end_zone = zones['z'+String(Math.floor(Math.random() * 4) + 1)];
                		var startx = start_zone.lbx + Math.floor(Math.random() * (start_zone.ubx - start_zone.lbx));
                		var starty = start_zone.lby + Math.floor(Math.random() * (start_zone.uby - start_zone.lby));
                		var endx = end_zone.lbx + Math.floor(Math.random() * (end_zone.ubx - end_zone.lbx));
                		var endy = end_zone.lby + Math.floor(Math.random() * (end_zone.uby - end_zone.lby));
                		var rider = new Rider('r'+String(num_riders+1), city, startx, starty, endx, endy);
                		var r = Math.floor(Math.random() * 255);
                   		var g = Math.floor(Math.random() * 255);
                   		var b = Math.floor(Math.random() * 255);
                   		rider.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
                		num_riders++;
                		city.updateAgentRider(rider, rider.x, rider.y, rider.endx, rider.endy);
                		scheduler.scheduleRepeatingIn(rider, 1);
                	}
                }

                reset();
                createTPs();
                createCars();
                createMetrics();

                setInterval(maybeSpawnRidersRandom, 1000);

				var canvas = document.getElementById("myCanvas");
              	setInterval(function(){ 
                      scheduler.update();
                      
                      city.render(canvas);
                      console.log('current simulation time: ' + scheduler.current_time);
                      document.getElementById("simTime").value = "Simulation Time: " + scheduler.current_time;

                      var agents = city.findAllAgents();
                      document.getElementById("avgRiders").value = agents['m'].avgRiders;
                  }, 500);
})();



