const mongoose = require("mongoose");
const meeting = mongoose.model(
    "meeting",
    mongoose.Schema({
        hostId:{
            type:String,
            required:true
        },
        hostName:{
            type:String,
            required:true
        },
        startTime:{
            type:Date,
            required:true
        },
        meetingUsers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"meetingUser"
            }
        ]
    },{
        toJSON:{
            transform:(doc,ret)=>{
                ret.id=ret._id.toString(),
                delete ret._id;
                delete ret.__v;
            }
        }
    },{
        timeStamps:true
    })
)
module.exports = {
    meeting
}