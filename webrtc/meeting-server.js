const { Socket } = require("socket.io");
const meetingHelper = require("./utils/meeting-helper");
const { meetingPayloadEnum } = require('./utils/meeting-payload.enum')

const parseMessage = (message) => {
    try {
        const payload = JSON.parse(message);
        return payload;
    } catch (error) {
        return { type: meetingPayloadEnum.UNKNOWN }
    }
}

const listenMessage = (meetingId, socket, meetingServer) => {
    socket.on('message', (message) => handleMessage(meetingId, socket, meetingServer));
}
const handleMessage = (meetingId, socket, message, meetingServer) => {
    var payload = "";
    if (typeof message === 'string') {
        payload = parseMessage(message);
    } else {
        payload = message;
    }
    switch (payload.type) {
        case meetingPayloadEnum.JOINED_MEETING:
            meetingHelper.joinMeeting(meetingId, socket, payload, meetingServer)
            break;
        case meetingPayloadEnum.CONNECTION_REQUEST:
            meetingHelper.forwardConnectionRequest(meetingId, socket, payload, meetingServer)
            break;
        case meetingPayloadEnum.OFFER_SDP:
            meetingHelper.forwardOfferSDP(meetingId, socket, payload, meetingServer)
            break;
        case meetingPayloadEnum.ANSER_SDP:
            meetingHelper.forwardAnswerSDP(meetingId, socket, payload, meetingServer)
            break;
        case meetingPayloadEnum.LEAVE_MEETING:
            meetingHelper.userLeft(meetingId, socket, payload, meetingServer)
            break;
        case meetingPayloadEnum.END_MEETING:
            meetingHelper.endMeeting(meetingId, socket, payload, meetingServer)
            break;
        case meetingPayloadEnum.VIDEO_TOGGLE:
        case meetingPayloadEnum.AUDIO_TOGGLE:
            meetingHelper.forwardEvent(meetingId, socket, payload, meetingServer)
            break;
        case meetingPayloadEnum.UNKNOWN:
            break;
        default:
            break;

    }
}
const initMeetingServer = (server)=>{
    const meetingServer = require("socket.io")(server);
    meetingServer.on('connection',socket=>{
        const meetingId = socket.handshake.query.id;
        listenMessage(meetingId,socket,meetingServer)
    })
}
module.exports = {
    initMeetingServer
}