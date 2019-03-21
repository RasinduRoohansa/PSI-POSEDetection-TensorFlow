var mqtt = require('mqtt')

export function connectMQTT() {
    var client = new Paho.MQTT.Client("54.255.195.241", 8080, "clientId-" + parseInt(Math.random() * 100, 10));
// set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
        onSuccess:onConnect,
        onFailure:doFail,
        useSSL: true
    }
    // connect the client
    client.connect(options);
    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        client.subscribe("my/topic1");
    }
    function doFail(e){
        console.log(e);
    }
    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
        document.write(message.payloadString);
        alert("messgaearrived!")
    }
}
