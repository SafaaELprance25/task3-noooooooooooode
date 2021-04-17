const express = require('express')
const router = new express.Router()
const reporters = require('../models/reporters')
const auth = require('../middleware/auth')

router.post('/reporters', async (req, res) => {
    const user = new reporters(req.body)

    try {
        await user.save()
        const token = await user.generateToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/reporters/login', async (req, res) => {
    try {
        const user = await reporters.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()

        res.send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/profile',auth,async(req,res)=>{
    res.send(req.user)
})



router.get('/reporters',auth,(req,res)=>{
    reporters.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})


router.get('/reporters/:id',(req,res)=>{
   
    const _id = req.params.id
   reporters.findById(_id).then((user)=>{
        if(!user) 
        {
            return res.status(404).send('Unable to find repoter')
        }
        res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send('Connection error has occured')
    })
})


router.patch('/profile',auth,async(req,res)=>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','password']

    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('cannot update')
    }

    try{
        updates.forEach((update)=> (req.user[update] = req.body[update]))
        await req.user.save()
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})


router.delete('/profile',auth,async(req,res)=>{
    try{
      await req.user.remove()
      res.send('Deleted')
    }
    catch(e){
        res.send(e)
    }
})



router.post('/logout',auth,async(req,res)=>{
    try{
        
        req.user.tokens = req.user.tokens.filter((el)=>{
            return el.token !== req.token
        })

        await req.user.save()
        res.send('Logout suceessfully')
    }
    catch(e){
        res.status(500).send('Please login')
    }
})



router.post('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('Logout all suceesfully')
    }
    catch(e){
        res.send('Please Login again !')
    }
})

module.exports = router