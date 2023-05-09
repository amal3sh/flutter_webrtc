const {meeting}=require('../models/meeting.model');
const {meetingUser}=require('../models/meetingUser.model');
const getAllMeetingUsers =async(meetId,callBack)=>{
    meetingUser.find({meetingId:meetId})
    .then((response)=>{
        return callBack(null,response)
    })
    .catch((error)=>{
      return callBack(error)  ;
    })
}
const joinMeeting = async(params,callBack)=>{
    const meetingUserModel = new meetingUser(params);
meetingUserModel.save().then(async(response)=>{
    await meeting.findOneAndUpdate({id:params.meetingId},{$addToSet:{"meetingUsers":meetingUserModel}})
    return callBack(null,response)
})
.catch((error)=>{
    return callBack(error)
})
}

const startMeeting = async(params,callBack)=>{
    const meetingSchema = new meeting(params)
    .save()
    .then((response)=>{
        return callBack(null,response)
    })
    .catch((error)=>{
        return callBack(error)
    })
}

const isMeetingPresent = async(meetingId,callBack)=>{
    meeting.findById(metingId)
    .populate("meetingUsers","meetingUser")
    .then((response)=>{
        if(!response)callBack("Invalid meeting ID")
        else callBack(null,true);
    })
    .catch((error)=>{
        return callBack(error,false)
    })
}
const checkMeetingExists = async(meetingId,callBack)=>{
    meeting.findById(meetingId,"hostId,hostName,startTime")
    .populate("meetingUsers","meetingUser")
    .then((response)=>{
        if(!response)callBack("Invalid meeting id");
        else callBack(null,true)
    })
    .catch((error)=>{
        return callBack(error,false)
    })
}
const getMeetingUser = async(params,callBack)=>{
    const {meetingId,userId}= params;
    meetingUser.find({meetingId,userId})
    .then((response)=>{
        return callBack(null,response[0])
    })
    .catch((error)=>{
        return callBack(error);
    })
}
const updateMeetingUser = async(params,callBack)=>{
    meetingUser
    .updateOne({userId:params.userId},{$set:params},{new:true})
    .then((response)=>{
        return callBack(null,response);
    })
    .catch((error)=>{
        return callBack(error);
    })
}
const getUserBySocketId = async(params,callBack)=>{
    const{meetingId,socketId}=params;
    meetingUser.find({meetingId,socketId})
    .limit(1)
    .then((response)=>{
        return callBack(null,response)
    })
    .catch((error)=>{
        return callBack(error)
    })

}
module.exports = {
    getAllMeetingUsers,
    joinMeeting,
    isMeetingPresent,
    startMeeting,
    checkMeetingExists,
    getMeetingUser,
    getUserBySocketId,
    updateMeetingUser

}