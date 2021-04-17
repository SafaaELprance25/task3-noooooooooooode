const mongoose = require('mongoose')

const newsScehma = new mongoose.Schema(
    {

    title:{
        type:String,
        trim:true,
        required:true

    },
    description:{
        type:String,
        trim:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'reporters'
    }
},

{
    timestamps:true
}


)

const News = mongoose.model('News',newsScehma)

module.exports = News