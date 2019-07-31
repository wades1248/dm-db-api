# DM DB API

This is an API for use with DM DB, an app that generates random encouters and tracks initiative for Dungeons and Dragons 5th Edition. Users may store, update, and access player data on the server and access creature data. 

## Technologies

This API was built using node.js. The datebase was built with postgres.sql. Migrations are handled with postgrator. 

## CORS

This API supports full CORS accessability, with CRUD operations for "players" data, only GET endpoints are supported for "creature" data.
