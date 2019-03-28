var mqtt = require('mqtt');

var websocket="localhost";
var port=19001;
var user="admin";
var pass="pass#word1";
var client ;

export function connectMQTT() {
    console.log('Connecting to MQTT')
     client = new Paho.MQTT.Client(websocket, port, "psi_"+ parseInt(Math.random() * 100, 10));

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    var options = {
        onSuccess:onConnect,
        onFailure:doFail
    }

    client.connect(options);

    function onConnect() {
        console.log("MQTT Connected");
        client.subscribe("/sensor/#");
    }

    function doFail(e){
        console.log(e);
    }

    function onConnectionLost(responseObject) {
        console.log('MQTT Not Connected');
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }

    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.destinationName);
        console.log("message.payloadString:"+message.payloadString);
    }

}

function sendMessage(message,topic){
    var message = new Paho.MQTT.Message(message);
    message.destinationName ='hr1/'+topic;
    client.send(message);
}

export function formatPoses(stringValue) {
    // sendMessage(JSON.parse(stringValue));
    // console.log(stringValue)
    const iterator = stringValue.values();

    for (const value of iterator) {
        // if(value.part == 'rightShoulder' || value.part == 'rightElbow' || value.part == 'rightWrist' || value.part=='nose'){
            var obj=new Object();
            obj.x=value.position.x;
            obj.y=value.position.y;
            var jsonString= JSON.stringify(obj);
            console.log(jsonString);
            sendMessage(jsonString,value.part);
        // }
    }
}





