const mongoose= require("mongoose")
const express= require("express")

const app= express()

const QrSchema= mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: String,
        default: Date.now,
    },
    
})

const QrModel=mongoose.model("AllQr",QrSchema)

module.exports={QrModel}