const router = require('express').Router();
const config = require('../config.json');
const PostModel = require('../model/post');
const TagModel = require('../model/tag');
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
router.get('/', async function(req, res) {
	try {
		const data = await PostModel.find({});
		return res.status(200).json(data.map((item) => ({
			id: item._id,
			title: item.title,
			content: item.content,
			author: item.author,
			timestamp: item.timestamp,
			image: `http://${config.host.host}:${config.host.port}/image/${item.image}`,
		})));
	} catch (err) {
		return res.status(500).json();
	}
});

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
router.get('/popular', async function(req, res) {
	try {
		const data = await PostModel.find({}).limit(4);
		return res.status(200).json(data.map((item) => ({
			id: item._id,
			title: item.title,
			content: item.content,
			author: item.author,
			timestamp: item.timestamp,
			image: `http://${config.host.host}:${config.host.port}/image/${item.image}`,
			tags: item.tags,
		})));
	} catch (err) {
		console.log(err);
		return res.status(500).json({});
	}
});

/**
 * @swagger
 * paths:
 *  /post/tag:
 *   get:
 *    description: "Get All Tags"
 *    tags: [post]
 *    responses:
 *      200:
 *        description: "Success Get All Tags"
 *        content:
 *          application/json:
 *            schema:
 *             type: array
 *             items:
 *              type: string
 */
router.get('/tag', async function(req, res) {
	try {
		const tags = await TagModel.find({});
		return res.status(200).json(tags.map((tag) => tag.name));
	} catch (err) {
		console.log(error);
		return res.status(500).json();
	}
});

/**
 * @swagger
 * paths:
 *  /post/:id:
 *    get:
 *      description: "Get Post By Id"
 *      tags: [post]
 */
router.get('/:Id', async function(req, res) {
	const { Id } = req.params;
	if (!Id) return res.status(404).json({});
	try {
		const item = await PostModel.findById(Id);
		return res.status(200).json({
			id: item._id,
			title: item.title,
			content: item.content,
			author: item.author,
			timestamp: item.timestamp,
			image: `http://${config.host.host}:${config.host.port}/image/${item.image}`,
			tags: item.tags,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({});
	}
});

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
