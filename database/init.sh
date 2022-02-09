#! /bin/bash

mongoimport --jsonArray \
    --db=blog-db \
    --collection=users \
    --drop \
    --jsonArray \
    /start/user.json

mongoimport --jsonArray \
    --db=blog-db \
    --collection=posts \
    --drop \
    --jsonArray \
    /start/post.json

mongoimport --jsonArray \
    --db=blog-db \
    --collection=tags \
    --drop \
    --jsonArray \
    /start/tag.json