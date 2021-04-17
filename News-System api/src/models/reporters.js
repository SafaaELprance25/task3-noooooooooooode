const mongoose = require('mongoose')
const validator = require ('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reportersSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        trim:true
    },
    age:{
        type:Number,
        defult:18,
        validate(value){
            if(value<0){
                throw new Error('age must be positive number')
            }
        }
    },
    password:{
        type:String,
            required:true,
            trim:true,
            minLength:6,
            lowercase:true,
            validate(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error('password cannot contain password word')
                }
            }

        },
    email:{
            type:String,
            lowercase:true,
            unique:true,
            required:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('email is invalid')
                }
            }


        },
    tokens:[{
            token:{
                type:String,
                required:true
            }
    }]
    
    
},

{
    timestamps:true
}
)


reportersSchema.virtual('news',{
    ref:'News',
    localField: '_id',
    foreignField:'owner'


})

reportersSchema.statics.findByCredentials = async (email, password) => {
    const user = await reporters.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

reportersSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

reportersSchema.methods.generateToken = async function(){

    const user = this 

    const token = jwt.sign({_id:user._id.toString()},'news system')

    user.tokens = user.tokens.concat({token:token})

    await user.save()

    return token
}


reportersSchema.methods.toJSON = function(){
   
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}

const reporters = mongoose.model('reporters', reportersSchema )
module.exports = reporters