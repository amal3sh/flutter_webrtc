const mongoose = require("mongoose");
const meetingUser = mongoose.model(
    "meetingUser",
    mongoose.Schema({
        socketId:{
            type:String,
            required:true
        },
        meetingId:{
            type:mongoose.Schema.Types.ObjectId,
            required:"meeting"
        },
        userId:{
            type:String,
            required:true
        },
        joined:{
            type:Boolean,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        isAlive:{
            type:Boolean,
            required:true
        }
        
    },{
        timeStamps:true
    })
)
module.exports = {
    meetingUser
}