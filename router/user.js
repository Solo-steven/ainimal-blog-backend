const router = require('express').Router();
const JWT = require('jsonwebtoken');
const config = require('../config.json');
const PostModel = require('../model/post');

router.use(function (req, res, next) {
    const token = req.get("Authorization");
    if(!token)  return res.status(401).json({ message: "no token" });
    try {
        const payload  = JWT.verify(token,config.JWT);
        const  email = payload.email;
        if(!email) 
           return res.status(401).json({message: "token error"});
        req.session = { token, email };
        next();
    }catch (err) {
        return res.status(401).json({message: "need to refresh token"});
    }
});
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
 *        500:
 *          description: "Mongodb error"
 *          content:
 *              application/json:
 *                schema: 
 *                  $ref: "#components/schemas/ErrorMessage"
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
            image: `http://${config.host.host}:${config.host.port}/image/${item.image}`,
            tags: item.tags
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
 *      responses:
 *        200:
 *          description: "Success Create a User Post"
 *          content:
 *            application/json:
 *               schema: 
 *                 $ref: "#components/schemas/SuccessMessage"
 *        400:
 *          description: ""
 * 
 */
router.post("/post" , async function(req, res) {
    const email = req.session.email;
    const { title, content, tags } = req.body;
    if(!title || !content || !tags || (tags.length ===0 ))
        return res.status(400).json({message: "lock of necessary request body variable"});
    const post = new PostModel({
        title,
        content,
        tags,
        author: email,
        image: `seed${Math.floor(Math.random() * 7 + 1)}.jpg`,
        timestamp:  (new Date()).toISOString(),
    });
    post.save();
    res.status(200).json({ message: "success create post"});
});
/**
 * @swagger
 * paths:
 *  /user/post:
 *    put:
 *      description: "Change a Post of user(not yet)."
 *      tags: [user]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema: 
 *              $ref: "#components/schemas/UpdatePost"
 */
router.put("/post", async function(req, res) {
    const { title, content, tags, id, status } = req.body;
    if(!id || !title || !content || !status || !tags || (tags.length ===0 ))
        return res.status(400).json({message: "lock of necessary request body variable"});
    const post = await PostModel.findById(id);
    const email = req.session.email;
    if(email !== post.author)
        return res.status(403).json({message: "user error"});
    post.title = title;
    post.content = content;
    post.tags = tags;
    post.save();
    res.status(200).json({ message: "success update post"});
});
/**
 * @swagger
 * paths:
 *  /user/post/:Id:
 *   get:
 *      description: "Get A User Post By Id"
 *      tags: [user]
 *      parameters:
 *       - in: path
 *         name: Id
 *         schema:
 *            type: string
 *         description: "Id for user post"
 *      responses:
 *         200:
 *          description: "Success get user Post"
 *          content:
 *            application/json:
 *               schema:
 *                  $ref: "#/components/schemas/Post"
 *         400:
 *           description: "Lock of Id for request"
 *           content:
 *              application/json:
 *               schema:
 *                $ref: "#/components/schemas/ErrorMessage"
 *         403:
 *           description: "Access anther user's post"
 *           content:
 *              application/json:
 *               schema:
 *                $ref: "#/components/schemas/ErrorMessage"
 *         500:
 *           description: "Mongodb error"
 *           content:
 *              application/json:
 *               schema:
 *                $ref: "#/components/schemas/ErrorMessage"
 */
router.get("/post/:Id", async function(req, res) {
    const {Id} = req.params;
    if(!Id)
        return res.status(400).json({ message: "lock of id"});
    try{
        const post = await PostModel.findById(Id);
        const email = req.session.email;
        if(post.author !== email)
            return res.status(403).json({message: "user forbidden"});
        return res.status(200).json({
            id: post._id,
            title: post.title,
            content: post.content,
            author: post.author,
            timestamp: post.timestamp,
            image: `http://${config.host.host}:${config.host.port}/image/${post.image}`,
            tags: post.tags
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "Mongodb Error"})
    }
})
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
 *      UpdatePost:
 *          type: object
 *          properties:
 *             id:
 *               type: string
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
 *      ErrorMessage:
 *          type: object
 *          properties:
 *              message:
 *                type: string   
 *      SuceessMessage:
 *          type: object
 *          properties:
 *              message:
 *                type: string            
 */

module.exports = router;