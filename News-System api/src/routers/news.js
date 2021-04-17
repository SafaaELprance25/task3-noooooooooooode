const express = require('express')
const  router = new express.Router()
const News = require('../models/news')
const auth = require('../middleware/auth')

router.post('/news',auth,async(req,res)=>{
    const news= new News({...req.body,owner:req.user._id})
    try{
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/news',auth,async(req,res)=>{
    try{
        const news = await News.find({owner:req.user._id})
        res.send(news)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/news/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findById(_id)
        if(!news){
            return res.status(400).send('No news is found')
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body) 
    try{
        const news = await News.findById({_id,owner:req.user._id})
        if(!news){
            return res.status(404).send()
        }
        updates.forEach((update) => news[update]= req.body[update])

        await news.save()
        res.send(news)
    }catch(e){
        res.send(e)
    }
})

router.delete('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findByIdAndDelete({_id,owner:req.user._id})
        if(!news){
            return res.status(400).send()
        }
        res.send('Deleted')
    }
    catch(e){
        res.status(500).send()
    }
})


module.exports = router