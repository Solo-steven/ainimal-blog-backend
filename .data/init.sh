#! /bin/bash

mongoimport --jsonArray \
    --db=blog-db \
    --collection=users \
    --drop \
    --jsonArray \
    /.test/user.json

mongoimport --jsonArray \
    --db=blog-db \
    --collection=posts \
    --drop \
    --jsonArray \
    /.test/post.json
