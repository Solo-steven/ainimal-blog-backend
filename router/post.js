const router = require('express').Router();
const config = require('../config.json');
const PostModel = require('../model/post');

router.get("/", async function(req, res)  {
    try {
        const data = await PostModel.find({});
        return res.status(200).json(data.map(item => ({
            id: item._id,
            title: item.title,
            content: item.content,
            author: item.author,
            timestamp: item.timestamp,
            image: `http://${config.host.host}:${config.host.port}/image${item.image}`
        })));
    }catch(err) {
        return res.status(500).json()
    }
})

router.get("/popular", async function(req, res) {
    try {
        const data = await PostModel.find({}).limit(4);
        console.log(data);
        return res.status(200).json(data.map(item => ({
            id: item._id,
            title: item.title,
            content: item.content,
            author: item.author,
            timestamp: item.timestamp,
            image: `http://${config.host.host}:${config.host.port}/image${item.image}`
        })));
    }catch(err) {
        console.log(err);
        return res.status(500).json({})
    }
})

router.get("/:id", async function(req, res)  {
    const {id} = req.params;
    if(!id) return res.status(404).json({})
    try{
        const item = await PostModel.findById(id);
        return res.status(200).json({
            id: item._id,
            title: item.title,
            content: item.content,
            author: item.author,
            timestamp: item.timestamp,
            image: `http://${config.host.host}:${config.host.port}/image${item.image}`
        });
    }catch(err) {
        console.log(err);
        res.status(500).send({});
    }
})



module.exports = router;