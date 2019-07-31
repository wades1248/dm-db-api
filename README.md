# DM DB API

This is an API for use with DM DB, an app that generates random encouters and tracks initiative for Dungeons and Dragons 5th Edition. Users may store, update, and access player data on the server and access creature data. 

## Technologies

This API was built using node.js. The datebase was built with postgres.sql. Migrations are handled with postgrator. 

## CORS

This API supports full CORS accessability, with CRUD operations for "players" data, only GET endpoints are supported for "creature" data.

## API Documentation

### Authorization

This API requires Bearer token authorization with a verified API Token. As of now API tokens are not available to the public upon request.

### /creatures

The /creatures endpoint only supports GET requests to get all creatures in the database.
example url: https://desolate-harbor-63967.herokuapp.com/api/creatures

### /players

The /players endpoint supports GET and POST methods 
example url: https://desolate-harbor-63967.herokuapp.com/api/players

### /players/:player_ID

The /players/:player_ID endpoint supports GET, DELETE, and PATCH methods
example url: https://desolate-harbor-63967.herokuapp.com/api/players/1
