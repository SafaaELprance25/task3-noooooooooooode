const jwt = require('jsonwebtoken')
const reporters = require('../models/reporters')
const auth = async(req,res,next) =>{

    try{
        const token = req.header('Authorization').replace('Bearer ','')

        const decode = jwt.verify(token,'news system')
        console.log(decode)

        const user = await reporters.findOne({_id:decode._id , 'tokens.token':token})

        if(!user){
            throw new Error('Error has occurred')
        }

        req.user = user
        req.token = token
        next()

    }catch(e){
        res.status(401).send({
            error:'You need authentiction '
        })

    }

}

module.exports = auth