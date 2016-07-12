// 
var util = require('util');

var async = require('async');

// Import the Sensortag functions
var SensorTag = require('./index');

// Use the HTTP POST request to stream your data to the HCP
// Modify the http_request file in die lib folder before using!

//var httpPost = require ('./lib/http_request')  

var USE_READ = true;

// Function to discover the Sensortag 
SensorTag.discover(function(sensorTag) {
  console.log('discovered: ' + sensorTag);
// Function to disconnect the Raspberry from the Sensortag
  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });
// Main program; Async module is used for flow control (see https://www.npmjs.com/package/async)
  async.series([
// Connect t
      function(callback) {
        console.log('connectAndSetUp');
        sensorTag.connectAndSetUp(callback);
      },
// Activate the temperature sensor
      function(callback) {
        console.log('enableIrTemperature');
        sensorTag.enableIrTemperature(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readIrTemperature');
          sensorTag.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
            console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
//			Use this function to stream the data to the HCP			
//			httpPost.tmp(ambientTemperature.toFixed(2));
			setTimeout(callback, 5000);
          });
//	Set USE_READ=0 to get data in case of an temperature change
        } else {
          sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
            console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1))
          });
          console.log('setIrTemperaturePeriod');
          sensorTag.setIrTemperaturePeriod(500, function(error) {
            console.log('notifyIrTemperature');
            sensorTag.notifyIrTemperature(function(error) {
              setTimeout(function() {
                console.log('unnotifyIrTemperature');
                sensorTag.unnotifyIrTemperature(callback);
              }, 5000);
            });
          });
        }
      },
// Turn off the sensor
      function(callback) {
        console.log('disableIrTemperature');
        sensorTag.disableIrTemperature(callback);
	  },
// Disconnect the Raspberry Pi from the Sensortag
      function(callback) {
        console.log('disconnect');
        sensorTag.disconnect(callback);
      }
   
   ]
  );
});
