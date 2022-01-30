const express = require('express');
const app = express();
const config = require('./config.json');
const mongoose = require("mongoose");
const cors = require('cors');
const postRouter = require('./router/post');
const authRouter = require('./router/auth');
const userRouter = require('./router/user');
const path = require('path');
const swaagerJSDoc = require('swagger-jsdoc');
const swaggerServer = require('swagger-ui-express');

const jsdoc = swaagerJSDoc(config.swagger);
app.use('/doc', swaggerServer.serve, swaggerServer.setup(jsdoc));

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: config.cors
}));

app.use("/image", express.static(path.join(__dirname, "static")));
app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(config.host.port, async () => {
    const { host, port, name } = config.db
    await mongoose.connect(`mongodb://${host}:${port}/${name}`);
    console.log("Server start at port ", config.host.port);
});
