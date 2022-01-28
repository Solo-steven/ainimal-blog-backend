const express = require('express');
const app = express();
const config = require('./config.json');
const mongoose = require("mongoose");
const cors = require('cors');
const postRouter = require('./router/post');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: config.front
}));

app.use("/image", express.static(path.join(__dirname, "static")));
app.use("/post", postRouter);

app.listen(config.host.port, async () => {
    const { host, port, name } = config.db
    await mongoose.connect(`mongodb://${host}:${port}/${name}`);
    console.log("Server start at port ", config.host.port);
});
