(
  function(){
    
      function reset() {
          scheduler.reset();
          city.reset();
      }

      /*function createZoneControllers() {
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
          for(var i=1; i < num_tps+1; i++) {
              var tp = new TransferPoint('tp'+String(i), city, i*250+20, i*220+50);
              var zc1 = city.getAgent('zc'+String(i));
              var zc2 = city.getAgent('zc'+String(i+1));
              zc1.addTransferPoint(tp, 'sw');
              zc2.addTransferPoint(tp, 'ne');

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

      function maybeSpawnRidersRandom() {
          var willGenerateRider = Math.floor(Math.random() * 100) < rider_probability;
          if (willGenerateRider) {
              var start_zone_controller = city.getAgent('zc'+String(Math.floor(Math.random() * num_zcs) + 1));
              var end_zone_controller = city.getAgent('zc'+String(Math.floor(Math.random() * num_zcs) + 1));
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
      */

      function createZoneControllers() {
          rows = Math.sqrt(num_zcs);
          columns = Math.sqrt(num_zcs);
          for(var r = 1; r < rows+1; r++) {
              for(var c = 1; c < columns+1; c++) {
                  var zone = new Zone((c-1)*250+20, (r-1)*220+50, c*250+20, r*220+50);
                  var zc = new ZoneController('zc'+String(r)+String(c), city, zone);
                  city.agents[zc.id] = zc;

                  city.drawLine(zone.lbx, zone.lby, zone.lbx, zone.uby);
                  city.drawLine(zone.lbx, zone.uby, zone.ubx, zone.uby);
                  city.drawLine(zone.lbx, zone.lby, zone.ubx, zone.lby);
                  city.drawLine(zone.ubx, zone.lby, zone.ubx, zone.uby); 
              }
          }
      }

      function createTransferPoints() {
          for(var i=1; i < 3+1; i++) { // southern points
              var tp = new TransferPoint('tp'+String(i), city, i*250+20, 50);
              var zc1 = city.getAgent('zc1'+String(i));
              var zc2 = city.getAgent('zc1'+String(i+1));

              zc1.addTransferPoint(tp, 'se');
              zc2.addTransferPoint(tp, 'sw');

              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }

          for(var i=1; i < 3+1; i++) { // western points
              var tp = new TransferPoint('tp'+String(i+3), city, 20, i*220+50);
              var zc1 = city.getAgent('zc'+String(i)+'1');
              var zc2 = city.getAgent('zc'+String(i+1)+'1');

              zc1.addTransferPoint(tp, 'nw');
              zc2.addTransferPoint(tp, 'sw');

              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }

          for(var i=1; i < 3+1; i++) { // middle points - first row
              var tp = new TransferPoint('tp'+String(i+6), city, i*250+20, 1*220+50);
              var zc1 = city.getAgent('zc1'+String(i));
              var zc2 = city.getAgent('zc1'+String(i+1));
              var zc3 = city.getAgent('zc2'+String(i));
              var zc4 = city.getAgent('zc2'+String(i+1));

              zc1.addTransferPoint(tp, 'ne');
              zc2.addTransferPoint(tp, 'nw');
              zc3.addTransferPoint(tp, 'se');
              zc4.addTransferPoint(tp, 'sw');

              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }

          for(var i=1; i < 3+1; i++) { // middle points - second row
              var tp = new TransferPoint('tp'+String(i+9), city, i*250+20, 2*220+50);
              var zc1 = city.getAgent('zc2'+String(i));
              var zc2 = city.getAgent('zc2'+String(i+1));
              var zc3 = city.getAgent('zc3'+String(i));
              var zc4 = city.getAgent('zc3'+String(i+1));

              zc1.addTransferPoint(tp, 'ne');
              zc2.addTransferPoint(tp, 'nw');
              zc3.addTransferPoint(tp, 'se');
              zc4.addTransferPoint(tp, 'sw');

              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }

          for(var i=1; i < 3+1; i++) { // middle points - third row
              var tp = new TransferPoint('tp'+String(i+12), city, i*250+20, 3*220+50);
              var zc1 = city.getAgent('zc3'+String(i));
              var zc2 = city.getAgent('zc3'+String(i+1));
              var zc3 = city.getAgent('zc4'+String(i));
              var zc4 = city.getAgent('zc4'+String(i+1));

              zc1.addTransferPoint(tp, 'ne');
              zc2.addTransferPoint(tp, 'nw');
              zc3.addTransferPoint(tp, 'se');
              zc4.addTransferPoint(tp, 'sw');

              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }

          for(var i=1; i < 3+1; i++) { // eastern points
              var tp = new TransferPoint('tp'+String(i+15), city, 4*250+20, i*220+50);
              var zc1 = city.getAgent('zc'+String(i)+'4');
              var zc2 = city.getAgent('zc'+String(i+1)+'4');

              zc1.addTransferPoint(tp, 'ne');
              zc2.addTransferPoint(tp, 'se');

              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }

          for(var i=1; i < 3+1; i++) { // northern points
              var tp = new TransferPoint('tp'+String(i+18), city, i*250+20, 4*220+50);
              var zc1 = city.getAgent('zc4'+String(i));
              var zc2 = city.getAgent('zc4'+String(i+1));

              zc1.addTransferPoint(tp, 'ne');
              zc2.addTransferPoint(tp, 'nw');

              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              tp.color = "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
              city.updateAgent(tp, tp.x, tp.y);
              scheduler.scheduleRepeatingIn(tp, 1);
          }
      }

      

      function createCars() {
          var zoneMod = Math.sqrt(num_zcs);
          for(var i=0; i < num_cars; i++) {
              var zoneIndex = i % num_zcs;
              var zrow = Math.floor(zoneIndex / zoneMod) + 1;
              var zcol = (zoneIndex % zoneMod) + 1;
              var zc = city.getAgent('zc'+String(zrow)+String(zcol));
              var zone = zc.getZone();
              var startx = 0.5*(zone.lbx + zone.ubx);
              var starty = 0.5*(zone.lby + zone.uby);
              var car = new Car('c'+String(i+1), city, startx, starty);
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
          var zoneMod = Math.sqrt(num_zcs);
          var willGenerateRider = Math.floor(Math.random() * 100) < rider_probability;
          if (willGenerateRider) {
              var zc_row_s = Math.floor(Math.random() * zoneMod) + 1;
              var zc_col_s = Math.floor(Math.random() * zoneMod) + 1;
              var zc_row_e = Math.floor(Math.random() * zoneMod) + 1;
              var zc_col_e = Math.floor(Math.random() * zoneMod) + 1;
              var start_zone_controller = city.getAgent('zc'+String(zc_row_s)+String(zc_col_s));
              var end_zone_controller = city.getAgent('zc'+String(zc_row_e)+String(zc_col_e));
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
              document.getElementById("simTime").value = scheduler.current_time;
              var metrics = city.getAgent('m');
              document.getElementById("avgRiders").value = metrics.avgRiders;
              document.getElementById("completedTrips").value = metrics.completedTrips;
          }, 
          500
      );
  }
)();



