#!/usr/bin/env node
// Loading Dependencies
var http = require("http");
var https = require('https');
var express = require("express");
var app = express();
var nconf = require('nconf');
nconf.file({ file: './config.json' });
//var config = require('./config.js');
fs = require('fs');
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO


////////////////////////////////////////
// Logger Function
////////////////////////////////////////
var logger = function(mod,str) {
    console.log("[%s] [%s] %s", new Date().toISOString(), mod, str);
}

logger("Modules","Modules loaded");

var httpport = nconf.get('httpport');
var relaystate = 0;
var miliolddate = new Date().getTime();
var milinewdate = new Date().getTime();
var firstexecution = true;

//////////////////////////////////////////////////////////////////
// Creating Endpoints
// Those Endpoints will receive a HTTP GET Request
// Execute the associated Method to make the following:
//  "/" - Used to check if the alarm is running
//  "/api/alarmArmAway" - Used to arm the alarm in away mode
//////////////////////////////////////////////////////////////////

// Used only to check if NodeJS is running
app.get("/", function (req, res) {
    res.send("<html><body><h1>FirePlace ON</h1></body></html>");
});

// Used to arm the alarm using the alarm password
app.get("/api/fireplaceON", function (req, res) {
    relaycontrol();
    logger("HTTP","Request at /api/fireplaceON");
    //res.send("200 OK");
    res.end();
});

// Used to arm the alarm using the alarm password
app.get("/api/fireplaceOFF", function (req, res) {
    
    logger("HTTP","Request at /api/fireplaceOFF");
    //res.send("200 OK");
    res.end();
});

/**
 * Subscribe route used by SmartThings Hub to register for callback/notifications and write to config.json
 * @param {String} host - The SmartThings Hub IP address and port number
 */
app.get('/subscribe/:host', function (req, res) {
    var parts = req.params.host.split(":");
    nconf.set('notify:address', parts[0]);
    nconf.set('notify:port', parts[1]);
    nconf.save(function (err) {
      if (err) {
        logger("Subscribe",'Configuration error: '+err.message);
        res.status(500).json({ error: 'Configuration error: '+err.message });
        return;
      }
    });
    res.end();
    logger("Subscribe","SmartThings HUB IpAddress: "+parts[0] +" Port: "+ parts[1]);
});

logger("HTTP Endpoint","All HTTP endpoints loaded");

////////////////////////////////////////
// Creating Server
////////////////////////////////////////
var server = http.createServer(app);
server.listen(httpport);
logger("HTTP Endpoint","HTTP Server Created at port: "+httpport);

////////////////////////////////////////
// Preparing GPIO
////////////////////////////////////////
var LED = new Gpio(21, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(4, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var relay = new Gpio(23, 'out')



///////////////////////////////////////////
// Function to send alarm msgs to SmartThing
///////////////////////////////////////////
function sendSmartThingMsg(command) {
    var msg = JSON.stringify({type: 'zone', command: command});
    notify(msg);
    logger("SendMartthingsMsg","Sending SmartThing comand: " + msg);
}

///////////////////////////////////////////
// Send HTTP callback to SmartThings HUB
///////////////////////////////////////////
/**
 * Callback to the SmartThings Hub via HTTP NOTIFY
 * @param {String} data - The HTTP message body
 */
var notify = function(data) {
    if (!nconf.get('notify:address') || nconf.get('notify:address').length == 0 ||
      !nconf.get('notify:port') || nconf.get('notify:port') == 0) {
      logger("Notify","Notify server address and port not set!");
      return;
    }
  
    var opts = {
      method: 'NOTIFY',
      host: nconf.get('notify:address'),
      port: nconf.get('notify:port'),
      path: '/notify',
      headers: {
        'CONTENT-TYPE': 'application/json',
        'CONTENT-LENGTH': Buffer.byteLength(data),
        'device': 'fireplace'
      }
    };
  
    var req = http.request(opts);
    req.on('error', function(err, req, res) {
      logger("Notify","Notify error: "+err);
    });
    req.write(data);
    req.end();
}





//var tempvalue = LED.readSync();
//console.log("Temp value: "+tempvalue);

pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
    logger("PUSHBUTTON","PUSHBUTTON Action ON/OFF");
    if (err) { //if an error
        console.error('There was an error', err); //output error message to console
        logger("PUSHBUTTON","PUSHBUTTON Error" + err);
        return;
    }
  /*
  LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
  relay.writeSync(value);
  console.log("Led value: " + value);
  if(value == 1){
    console.log("Led Ligado!");
  }
  else{
    console.log("Led Desligado");
  }
  */
    relaycontrol()
});


function relaycontrol(){
    
    milinewdate = new Date().getTime();
    var dif = milinewdate - miliolddate
    if(dif > 100 || firstexecution){
        //relaystate = relay.readSync();
        //relaystate = LED.readSync();
        logger("RELALAYCONTROL","Relay State value: " + relaystate);
        if (relaystate == 1) {
            relaystate = 0;
            logger("RELALAYCONTROL","Changing Relay State to OFF: " + relaystate);
            //relay.writeSync(relaystate);
            LED.writeSync(relaystate);
            // Call to SmartThings to update the App
        }else{
            relaystate = 1;
            logger("RELALAYCONTROL","Changing Relay State to ON: " + relaystate);
            //relay.writeSync(relaystate);
            LED.writeSync(relaystate);
            // Call to SmartThings to update the App
        }        
    }
    else{
        logger("RELALAYCONTROL","IGNORED EVENT! Dif: " + dif);
    }

    /*
    // backup para o test do tempo
    //relaystate = relay.readSync();
    //relaystate = LED.readSync();
    logger("RELALAYCONTROL","Relay State value: " + relaystate);
    if (relaystate == 1) {
        relaystate = 0;
        logger("RELALAYCONTROL","Changing Relay State to: " + relaystate);
        //relay.writeSync(relaystate);
        LED.writeSync(relaystate);
        // Call to SmartThings to update the App
    }else{
        relaystate = 1;
        logger("RELALAYCONTROL","Changing Relay State to: " + relaystate);
        //relay.writeSync(relaystate);
        LED.writeSync(relaystate);
        // Call to SmartThings to update the App
    }
    */
   
    miliolddate = new Date().getTime();
    firstexecution = false;
};



function unexportOnClose() { //function to run when exiting program
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  relay.writeSync(0);
  relay.unexport();
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c
