const { meeting } = require('../models/meeting.model');
const meetingServices = require('../services/meeting.service');
const {meetingPayloadEnum}=require('./meeting-payload.enum');

const joinMeeting = async(meetingId,socket,payload,meetingServer)=>{
    const {userId,name}=payload;
    meetingServices.isMeetingPresent(meetingId,async(error,results)=>{
        if(error && !results){
            sendMessage(socket,{
                type:meetingPayloadEnum.NOT_FOUND
            })
        }
        if(results){
            addUser(socket,{meetingId,userId,name}).then((result)=>{
                if(result){
                    sendMessage(socket,{
                        type:meetingPayloadEnum.JOINED_MEETING,data:{
                            userId
                        }
                    })
                    broadcastUsers(meetingId,socket,meetingServer,{
                        type:meetingPayloadEnum.USER_JOINED,
                        data:{
                            userId,
                            name,
                            ...payload.data
                        }
                    })
                }
            })
        }
    })
    
}

const forwardConnectionRequest = (meetingId,socket,meetingServer,payload)=>{
    const {userId,otherUserId,name}=payload.data;
    var model = {
        meetingId:meetingId,
        userId:otherUserId
    }
    meetingServices.getAllMeetingUsers(model,(error,results)=>{
        if(results){
            var sendPayload =JSON.stringify({
                type:meetingPayloadEnum.CONNECTION_REQUEST,
                data:{
                    userId,
                    name,
                    ...payload.data
                }
            }) 
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}
const forwardIceCandidate = (meetingId,socket,meetingServer,payload)=>{
    const {userId,otherUserId,candidate}=payload.data;
    var model = {
        meetingId:meetingId,
        userId:otherUserId
    }
    meetingServices.getAllMeetingUsers(model,(error,results)=>{
        if(results){
            var sendPayload =JSON.stringify({
                type:meetingPayloadEnum.ICECANDIDATE,
                data:{
                    userId,
                    candidate
                   
                }
            }) 
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}
const forwardOfferSDP = (meetingId,socket,meetingServer,payload)=>{
    const {userId,otherUserId,sdp}=payload.data;
    var model = {
        meetingId:meetingId,
        userId:otherUserId
    }
    meetingServices.getAllMeetingUsers(model,(error,results)=>{
        if(results){
            var sendPayload =JSON.stringify({
                type:meetingPayloadEnum.OFFER_SDP,
                data:{
                    userId,
                    sdp,
                    ...payload.data
                }
            }) 
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}
const forwardAnswerSDP = (meetingId,socket,meetingServer,payload)=>{
    const {userId,otherUserId,sdp}=payload.data;
    var model = {
        meetingId:meetingId,
        userId:otherUserId
    }
    meetingServices.getAllMeetingUsers(model,(error,results)=>{
        if(results){
            var sendPayload =JSON.stringify({
                type:meetingPayloadEnum.ANSER_SDP,
                data:{
                    userId,
                    sdp,
                    ...payload.data
                }
            }) 
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}
const userLeft = (meetingId,socket,meetingServer,payload)=>{
    const {userId}=payload.data;
 broadcastUsers(meetingId,socket,meetingServer,{
    type:meetingPayloadEnum.USER_LEFT,
    data:{
        userId:userId
    }
 })
}
const endMeeting = (meetingId,socket,meetingServer,payload)=>{
    const {userId}=payload.data;
 broadcastUsers(meetingId,socket,meetingServer,{
    type:meetingPayloadEnum.MEETING_ENDED,
    data:{
        userId:userId
    }
 })
 meetingServices.getAllMeetingUsers(meetingId,(error,results)=>{
    for(let i =0;i<results.length;i++){
        const meetingUser = results[i];
        meetingServer.sockets.connected[meetingUser.socketId].disconnect();
    }
 })
}
const forwardEvent = (meetingId,socket,meetingServer,payload)=>{
    const {userId}=payload.data;
 broadcastUsers(meetingId,socket,meetingServer,{
    type:payload.type,
    data:{
        userId:userId,
        ...payload.data
    }
 })
}
const addUser = (socket,{meetingId,userId,name})=>{
    let promise = new Promise((resolve,reject)=>{
        meetingServices.getMeetingUser({meetingId,userId},(error,results)=>{
            if(!results){
                var model = {
                    socketId:socket.id,
                    meetingId:meetingId,
                    userId:userId,
                    joined:true,
                    name:name,
                    isAlive:true
                };

                meetingServices.joinMeeting(model,(error,results)=>{
                    if(results){
                        resolve(true);
                    }
                    if(error){
                        reject(error)
                    }
                })

            }else{
                meetingServices.updateMeetingUser({
                    userId:userId,
                    socketId:socket.id,
                },(error,results)=>{
                    if(results) resolve(true)
                    if(error) reject(error)
                })
            }
        })
    })
    return promise;
}

const sendMessage = (socket,payload)=>{
    socket.send(JSON.stringify(payload))
}
const broadcastUsers = (meetingId,socket,meetingServer,payload)=>{
    socket.broadcast.emit("message",JSON.stringify(payload));
}
module.exports = {
    forwardAnswerSDP,
    forwardConnectionRequest,
    forwardEvent,
    forwardOfferSDP,
    forwardIceCandidate,
    joinMeeting,
    userLeft,
    endMeeting,
    forwardEvent

}