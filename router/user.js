const router = require('express').Router();
const JWT = require('jsonwebtoken');
const config = require('../config.json');
const PostModel = require('../model/post');


router.use(function (req, res, next) {
    const token = req.get("Authorization");
    if(!token)  return res.status(400).json({ message: "no token" });
    try {
        const payload  = JWT.verify(token,config.JWT);
        const  email = payload.email;
        if(!email) 
           return res.status(400).json({message: "token error"});
        req.session = { token, email };
        next();
    }catch (err) {
        return res.status(401).json({message: "need to refresh token"});
    }
})

/**
 * @swagger
 * paths:
 *   /user/post:
 *    get:
 *      description: "Get All Post of User (need token)"
 *      tags: [user]
 *      responses:
 *        200:
 *          description: "Success"
 *          content:
 *            application/json:
 *              schema: 
 *               type: array
 *               items:
 *                  $ref: "#/components/schemas/Post"
 */
router.get("/post", async function (req, res) {
    const email = req.session.email;
    try{
        const data = await PostModel.find({author: email});
        return res.status(200).json(data.map(item => ({
            id: item._id,
            title: item.title,
            content: item.content,
            author: item.author,
            timestamp: item.timestamp,
            image: `http://${config.host.host}:${config.host.port}/image/${item.image}`
        })));
    }catch (err) {
        return res.status(500).json({"message": "internal error"});
    }
});

/**
 * @swagger
 * paths:
 *  /user/post:
 *    post:
 *      description: "Create a new Post or save it as tmp. (need token)"
 *      tags: [user]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema: 
 *              $ref: "#components/schemas/CreatePost"
 */
router.post("/post" , async function(req, res) {
    const email = req.session.email;
    const { title, content, status, tags } = req.body;
    if(!title || !content || !status || !tags || (tags.length ===0 ))
        return res.status(400).json({message: "need four attributes in request body"});
    const post = new PostModel({
        title,
        content,
        status,
        author: email,
        tags,
        image: `test`,
        timestamp:  (new Date()).toISOString(),
    });
    post.save();
    res.status(200).json({ message: "success save post"});
});

/**
 * @swagger
 * paths:
 *  /user/post:
 *    put:
 *      description: "Change a Post of user"
 *      tags: [user]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema: 
 *              $ref: "#components/schemas/CreatePost"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *      CreatePost:
 *         type: object
 *         properties:
 *             title:
 *               type: string
 *             content:
 *                type: string
 *             status:
 *                type: string
 *             tags:
 *                type: array
 *                items:
 *                  type: string
 */


module.exports = router;