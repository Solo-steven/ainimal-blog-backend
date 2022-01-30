const router = require('express').Router();
const config = require('../config.json');
const PostModel = require('../model/post');

/** 
 * @swagger
 *  paths:
 *    /post:
 *      get:
 *       description: Get All Post
 *       tags: [post]
 *       responses:
 *          200:
 *            description: "All Post File"
 *            content:
 *               application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/Post"
 */

router.get("/", async function(req, res)  {
    try {
        const data = await PostModel.find({});
        return res.status(200).json(data.map(item => ({
            id: item._id,
            title: item.title,
            content: item.content,
            author: item.author,
            timestamp: item.timestamp,
            image: `http://${config.host.host}:${config.host.port}/image/${item.image}`
        })));
    }catch(err) {
        return res.status(500).json()
    }
})
/**
 * @swagger
 * paths:
 *  /post/popular:
 *    get:
 *     description: "Get pop posts"
 *     tags: ["post"]
 *     responses:
 *      200:
 *        description: "Popular Post"
 *        content:
 *          application/json:
 *            schema:
 *             type: array
 *             items:
 *              $ref: "#/components/schemas/Post"
 */
router.get("/popular", async function(req, res) {
    try {
        const data = await PostModel.find({}).limit(4);
        return res.status(200).json(data.map(item => ({
            id: item._id,
            title: item.title,
            content: item.content,
            author: item.author,
            timestamp: item.timestamp,
            image: `http://${config.host.host}:${config.host.port}/image/${item.image}`
        })));
    }catch(err) {
        console.log(err);
        return res.status(500).json({})
    }
})
/**
 * @swagger
 * paths:
 *  /post/:id:
 *    get:
 *      description: "Get Post By Id"
 *      tags: [post]
 */
router.get("/:id", async function(req, res)  {
    const {id} = req.params;
    if(!id) return res.status(404).json({})
    try {
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


/**
 * @swagger
 * components:
 *   schemas:
 *    Post:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       title:
 *         type: string
 *       content:
 *         type: string
 *       author:
 *         type: string
 *       timestamp:
 *         type: string
 *       image:
 *         type: string
 */


module.exports = router;