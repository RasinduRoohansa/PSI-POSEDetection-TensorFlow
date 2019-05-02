let W3CWebSocket = require('websocket').w3cwebsocket;
let client = new W3CWebSocket('ws://localhost:8081/', 'echo-protocol');

export function connectToWs() {
    client.onerror = function() {
        console.log('Connection Error');
    };

    client.onopen = function() {
        console.log('WebSocket Client Connected');
    };

    client.onclose = function() {
        console.log('echo-protocol Client Closed');
    };

    client.onmessage = function(e) {
        if (typeof e.data === 'string') {
            console.log('Received: \'' + e.data + '\'');
        }
    };
}

export function sendDatatoWs(stringValue) {
    const iterator = stringValue.values();
    let rsx, rsy, rex, rey, rwx, rwy;
    for (const value of iterator) {
        let obj = new Object();
        obj.x = value.position.x;
        obj.y = value.position.y;
        /**
         * Calculating Right Arm
         */
        switch (value.part) {
            case 'rightShoulder':
                rsx = value.position.x;
                rsy = value.position.y;
                break;
            case 'rightElbow':
                rex = value.position.x;
                rey = value.position.y;
                break;
            case 'rightWrist':
                rwx = value.position.x;
                rwy = value.position.y;
                break;
            default:
                break;
        }

        let rightArmpayload;

        if ((rsx != null) && (rsy != null) && (rex != null) && (rey != null) && (rwx != null) && (rwy != null)) {
            let StoEx = rex - rsx;
            let StoEy = rey - rsy;

            let EtoWx = rwx - rex;
            let EtoWy = rwy - rey;

            if ((StoEx > -35) && (StoEx < 35) && (EtoWx > -45) && (EtoWx < 35) && (StoEy > 35) && (EtoWy > 35)) {
                rightArmpayload = 'a';

            } else if ((StoEx < -30) && (StoEx > -200) && (EtoWx < -30) && (EtoWx > -200) && (StoEy < 40) && (StoEy > -20) && (EtoWy < 40) && (EtoWy > -20)) {
                rightArmpayload = 'b';

            } else if ((StoEx > -130) && (StoEx < 20) && (EtoWx > -55) && (EtoWx < 15) && (StoEy < 20) && (EtoWy < -50)) {
                rightArmpayload = 'c';

            } else {
                rightArmpayload = '!';

            }
        } else {
            rightArmpayload = 'No Right Arm Data ';
        }
        /**
         * Calculating Left Arm
         */
        let lsX, lsY, leX, leY, lwX, lwY;
        switch (value.part) {
            case 'leftShoulder':
                lsX = value.position.x;
                lsY = value.position.y;
                break;
            case 'leftElbow':
                leX = value.position.x;
                leY = value.position.y;
                break;
            case 'leftWrist':
                lwX = value.position.x;
                lwY = value.position.y;
                break;
            default:
                break;
        }
        let leftArmPayload;

        if ((lsX != null) && (lsY != null) && (leX != null) && (leY != null) && (lwX != null) && (lwY != null)) {
            let StoEx = leX - lsX;
            let StoEy = leY - lsY;

            let EtoWx = lwX - leX;
            let EtoWy = lwY - leY;

            if ((StoEx > -10) && (StoEx < 45) && (EtoWx > -20) && (EtoWx < 40) && (StoEy > 35) && (EtoWy > 35)) {
                leftArmPayload = 'h';

            } else if ((StoEx > 45) && (StoEx < 200) && (EtoWx > 45) && (EtoWx < 200) && (StoEy < 30) && (StoEy > -45) && (EtoWy < 30) && (EtoWy > -45)) {
                leftArmPayload = 'i';

            } else if ((StoEx < 150) && (EtoWx < 45) && (StoEy < 20) && (EtoWy < -60)) {
                leftArmPayload = 'j';

            } else {
                leftArmPayload = '!';
            }
        } else {
            leftArmPayload = 'No Left Arm Data ';
        }

        /**
         * Calculating Right/ Left Legs
         */
        let lhX, lhY, laX, laY, rhX, rhY, rkX, rkY, raX, raY,lkX,lkY;
        switch (value.part) {
            case 'leftHip':
                lhX = value.position.x;
                lhY = value.position.y;
                break;

            case 'leftKnee':
                lkX = value.position.x;
                lkY = value.position.y;
                break;

            case 'leftAnkle':
                laX = value.position.x;
                laY = value.position.y;
                break;

            case 'rightHip':
                rhX = value.position.x;
                rhY = value.position.y;
                break;

            case 'rightKnee':
                rkX = value.position.x;
                rkY = value.position.y;
                break;

            case 'rightAnkle':
                raX = value.position.x;
                raY = value.position.y;
                break;

            default:
                break;
        }
        let legsPayload;

        if ((lhX != null) && (lhY != null) && (lkX != null) && (lkY != null) && (laX != null) && (laY != null) && (rhX != null) && (rhY != null) && (rkX != null) && (rkY != null) && (raX != null) && (raY != null)) {

           let LHtoKx = lkX - lhX;
           let LHtoKy = lkY - lhY;

           let LHtoAx = laX - lhX;
           let LHtoAy = laY - lhY;

           let RHtoKx = rkX - rhX;
           let RHtoKy = rkY - rhY;

           let RHtoAx = raX - rhX;
           let RHtoAy = raY - rhY;

            if ((LHtoAx < 25) && (RHtoAx > -15)) {
                legsPayload = 'o';

            } else if ((LHtoAx > 25) && (RHtoAx < -20)) {
                legsPayload = 'p';


            } else {
                legsPayload = '!';
            }
        }else{
            legsPayload='No Legs Data '
        }

        if (client.readyState === client.OPEN) {
            client.send(rightArmpayload+leftArmPayload+legsPayload);
        }
    }
}
