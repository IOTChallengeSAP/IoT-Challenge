var util = require('util');

var async = require('async');

var SensorTag = require('./index');
var httpPost = require ('./lib/http_request')

var USE_READ = true;

SensorTag.discover(function(sensorTag) {
  console.log('discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

/*
    sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
        console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
        console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1))
    });
*/
    
    var readTemperature = function(){
        sensorTag.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
            console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
            httpPost.tmp(ambientTemperature.toFixed(2));
            setTimeout(readTemperature, 60000);
        });
    };

  async.series([
      function(callback) {
        console.log('connectAndSetUp');
        sensorTag.connectAndSetUp(function(a,b){
            console.log(a,b);
            callback();
        });
      },
      function(callback) {
        console.log('enableIrTemperature');
        sensorTag.enableIrTemperature(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
          console.log('readIrTemperature');
          readTemperature();
          callback();
      }
/*      ,
      function(callback) {
        console.log('disableIrTemperature');
        sensorTag.disableIrTemperature(callback);
     },
      function(callback) {
        console.log('disconnect');
        sensorTag.disconnect(callback);
      }*/
   
   ]
  );
});