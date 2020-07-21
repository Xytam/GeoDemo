const request = require('request');
const {Kafka} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'cta-producer',
  brokers: ['broker:29092']
});

const producer = kafka.producer();
//vPfbikZwhUMXtJCuhuJqARRBG
const ctaKey = "9384e1aed62f4ddd9a8e69721b884d63";
const routesUrl = "https://api.wmata.com/Bus.svc/json/jRoutes?api_key=" + ctaKey + "&format=json";
const baseVehicleUrl = "https://api.wmata.com/Bus.svc/json/jBusPositions?api_key=" + ctaKey + "&format=json";

//
timerFunc();
setInterval(timerFunc, 60000);

function timerFunc() {
  var routes = {};

  request(baseVehicleUrl, {json: true}, (err, res, body) => {
    if (err) {
      return console.log(JSON.stringify(err));
    }

    vehicles = body["BusPositions"];
     if (vehicles) {
       publishToKafka(vehicles, "VehicleID");
       }
     

    
  });
}

function publishToKafka(jsonObjs, idPath)
{
  var messagesArray = [];
  for (i of jsonObjs)
  {
    var message = {}
    message.key = i[idPath];
    message.value = JSON.stringify(i);
    messagesArray.push(message);
  }

  var data = {
    topic: "cta",
    messages: messagesArray
  }
  producer.connect();
  producer.send(data);
  console.log(data);
  producer.disconnect();
}
