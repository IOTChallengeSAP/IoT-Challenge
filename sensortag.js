var util = require('util');

var async = require('async');

var SensorTag = require('./index');

var USE_READ = true;
//-----------------------------------------------------------
//Host for your IoT server
var hostIoT = 'iotmmsacb28be61.hana.ondemand.com';
//port
var portIoT = 443;
//path to post data
var pathIoT = '/com.sap.iotservices.mms/v1/api/http/data/';
//this is the authorization token, format is Bearer <auth token>
//the auth token is taken from device ID on the IoT Services Cockpit
// this is a string so it surrounded by single quotes (')
var authStrIoT = 'Bearer 3dc7a438da5b8b8c96a91e4015a8474';
//the device ID that you are sending the data from
var deviceId = 'f1837d89-f2d6-4950-abf6-0d75d83d4c39';
// message type id for the device
var stationId = 1;
//var date = new Date();
//var time = date.getDate ();
var date = new Date();
var time = date.toJSON();
//just some data to send
var temp =9;
//------------------------------------------------------
function updateIoT(t) {
	var http = require('https');
	var options = {
	host: hostIoT,
	port: portIoT,
	path: pathIoT + deviceId,
	agent: false,
	headers: {
		'Authorization': authStrIoT,
		'Content-Type': 'application/json;charset=utf-8'
	},
	method: 'POST',
 };
 options.agent = new http.Agent(options);
 callback = function(response) {
	var body = '';
	response.on('data', function (data) {
		body += data;
	});
	response.on('end', function () {
	//console.log("END:", response.statusCode, JSON.parse(body).msg);
	});
	response.on('error', function(e) {
		console.error(e);
	});
 }
var req = http.request(options, callback);
 req.on('error', function(e) {
	console.error(e);
})
 date = new Date();
 time = date.toJSON();
console.log(time);
 req.shouldKeepAlive = false;
 var jsonData = {
	"mode":"sync",
	"messageType":"02b3114ae8cfd940e237", //replace messagetypeid with id from IOT cockpit
	"messages": [{
		"Tmp": t,
		"timestamp": time
	}]
 }
 var strData = JSON.stringify(jsonData);
 console.log("POST jsonData:" + strData);
 console.log("");
 req.write(strData);
 req.end();
};

SensorTag.discover(function(sensorTag) {
  console.log('discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  async.series([
      function(callback) {
        console.log('connectAndSetUp');
        sensorTag.connectAndSetUp(callback);
      },
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
			updateIoT(ambientTemperature.toFixed(2));
			setTimeout(callback, 5000);
         //   callback();
          });
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
      function(callback) {
        console.log('disableIrTemperature');
        sensorTag.disableIrTemperature(callback);
	  },
      function(callback) {
        console.log('disconnect');
        sensorTag.disconnect(callback);
      }
   
   ]
  );
});
