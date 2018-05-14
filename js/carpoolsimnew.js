(
  function(){
    
      function reset() {
          scheduler.reset();
          city.reset();
      }

      function createZoneControllers() {
          for(var i=1; i < num_zcs+1; i++) {
              var zone = new Zone((i-1)*250+20, (i-1)*220+50, i*250+20, i*220+50);
              var zc = new ZoneController('zc'+String(i), city, zone);
              city.agents[zc.id] = zc;

              city.drawLine(zone.lbx, zone.lby, zone.lbx, zone.uby);
              city.drawLine(zone.lbx, zone.uby, zone.ubx, zone.uby);
              city.drawLine(zone.lbx, zone.lby, zone.ubx, zone.lby);
              city.drawLine(zone.ubx, zone.lby, zone.ubx, zone.uby); 
          }
      }

      function createTransferPoints() {
          for(var i=0; i < num_tps; i++) {
              var tp = new TransferPoint('tp'+String(i+1), city, i*250+20, i*220+50);
              if (i == 0) {
                  var zc = city.getAgent('zc1');
                  zc.addTransferPoint(tp);
              }
              else if (i == num_tps-1) {
                  var zc = city.getAgent('zc'+String(i));
                  zc.addTransferPoint(tp);
              }
              else {
                  var zc1 = city.getAgent('zc'+String(i));
                  var zc2 = city.getAgent('zc'+String(i+1));
                  zc1.addTransferPoint(tp);
                  zc2.addTransferPoint(tp);
              }
              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }
      }

      function createCars() {
          for(var i=1; i < num_cars+1; i++) {
              var zoneIndex = (i % num_zcs) + 1;
              var zc = city.getAgent('zc'+String(zoneIndex));
              var zone = zc.getZone();
              var startx = 0.5*(zone.lbx + zone.ubx);
              var starty = 0.5*(zone.lby + zone.uby);
              var car = new Car('c'+String(i), city, startx, starty);
              zc.assignCar(car);
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
              var start_zone_controller = city.getAgent('zc'+String(Math.floor(Math.random() * 4) + 1));
              var end_zone_controller = city.getAgent('zc'+String(Math.floor(Math.random() * 4) + 1));
              var start_zone = start_zone_controller.getZone();
              var end_zone = end_zone_controller.getZone();
              var startx = start_zone.lbx + Math.floor(Math.random() * (start_zone.ubx - start_zone.lbx));
              var starty = start_zone.lby + Math.floor(Math.random() * (start_zone.uby - start_zone.lby));
              var endx = end_zone.lbx + Math.floor(Math.random() * (end_zone.ubx - end_zone.lbx));
              var endy = end_zone.lby + Math.floor(Math.random() * (end_zone.uby - end_zone.lby));
              var rider = new Rider('r'+String(num_riders+1), city, startx, starty, endx, endy);
              num_riders++;
              start_zone_controller.addRider(rider);
              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              rider.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgentRider(rider, rider.x, rider.y, rider.endx, rider.endy);
              scheduler.scheduleRepeatingIn(rider, 1);
          }
      }

      reset();
      createZoneControllers();
      createTransferPoints();
      createCars();
      createMetrics();

      setInterval(maybeSpawnRidersRandom, 1000);

      var canvas = document.getElementById("myCanvas");
      setInterval(
          function() { 
              scheduler.update();  
              city.render(canvas);
              document.getElementById("simTime").value = "Simulation Time: " + scheduler.current_time;
              var metrics = city.getAgent('m');
              document.getElementById("avgRiders").value = metrics.avgRiders;
          }, 
          500
      );
  }
)();



