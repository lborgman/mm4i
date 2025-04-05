const VERSION = "0.0.00";
logConsoleHereIs(`here is idb-replicator.js, module, ${VERSION}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

/*
This is for replicating indexedDB through WebRTC.

*/


export function establishConnection(remoteClientId) {
    // Create a signaling channel to communicate with the remote peer
    // const signalingChannel = getSignalingChannel(remoteClientId);
    const signalingChannel = new SignalingChannel(remoteClientId);

    // Create a new RTCPeerConnection object
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    const peerConnection = new RTCPeerConnection(configuration);

    // Set up event listeners for the peer connection
    // Local
    peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
            signalingChannel.send({ 'new-ice-candidate': event.candidate });
        }
    });

    // Remote
    signalingChannel.addEventListener('message', async message => {
        if (message.iceCandidate) {
            try {
                await peerConnection.addIceCandidate(message.iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });
    

    return { signalingChannel, peerConnection };
}

export function sendOffer(signalingChannel, peerConnection) {
    // Create an offer and set it as the local description
    peerConnection.createOffer().then(offer => {
        return peerConnection.setLocalDescription(offer);
    }).then(() => {
        // Send the offer to the remote peer through the signaling channel
        signalingChannel.send({ 'offer': peerConnection.localDescription });
    }).catch(error => {
        console.error('Error creating or sending offer:', error);
    });
}

export function handleOffer(signalingChannel, peerConnection) {
    // Listen for incoming offers from the signaling channel
    signalingChannel.addEventListener('message', async message => {
        if (message.offer) {
            // Set the received offer as the remote description
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));

            // Create an answer and set it as the local description
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // Send the answer back to the remote peer through the signaling channel
            signalingChannel.send({ 'answer': peerConnection.localDescription });
        }
    });
}



///////////////////////////////
//// code from https://webrtc.org/getting-started/peer-connections
///////////////////////////////

// FIX-ME: remoteClientId was not explained
/*
function getSignalingChannel(remoteClientId) {
    // Set up an asynchronous communication channel that will be
    // used during the peer connection setup
    const signalingChannel = new SignalingChannel(remoteClientId);
    return signalingChannel
}
*/


/*
async function makeCall() {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    const peerConnection = new RTCPeerConnection(configuration);
    signalingChannel.addEventListener('message', async message => {
        if (message.answer) {
            const remoteDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
        }
    });
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    signalingChannel.send({ 'offer': offer });
}
*/


/*
// Wait for call
const peerConnection = new RTCPeerConnection(configuration);
signalingChannel.addEventListener('message', async message => {
    if (message.offer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        signalingChannel.send({ 'answer': answer });
    }
});
*/



// Listen for local ICE candidates on the local RTCPeerConnection
/*
peerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
        signalingChannel.send({'new-ice-candidate': event.candidate});
    }
});
*/

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
/*
signalingChannel.addEventListener('message', async message => {
    if (message.iceCandidate) {
        try {
            await peerConnection.addIceCandidate(message.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});
*/


// Listen for connectionstatechange on the local RTCPeerConnection
/*
peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
        // Peers connected!
    }
});
*/

// Listen for connectionstatechange on the local RTCPeerConnection
/*
peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
        // Peers connected!
    }
});
*/