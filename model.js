const mongoose= require("mongoose")

const qrSchema= mongoose.Schema({
    number:{
        type:String,
        required:true
    },
    time:{
        type: String
    }
})

const qrModel=mongoose.model("allqr",qrSchema)

module.exports={qrModel}