const express = require('express')
const PlayersService = require('./players-service')
const xss = require('xss')
const playersRouter = express.Router()
const jsonParser = express.json()
const path = require('path')

const serializePlayer = player => ({
    id: player.id, 
    name: xss(player.name), 
    level: player.level,
    ac: player.ac,
    pp: player.pp,
    dmid: xss(player.dmid)
})
playersRouter
    .route('/')
    .get((req, res, next) => {
        const connect = req.app.get('db')
        PlayersService.getAllPlayers(connect)
            .then(players => {
                res.json(players.map(serializePlayer))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const connect = req.app.get('db')
        const {name, level, ac, pp, dmid} = req.body
        const newPlayer = {name, level, ac, pp, dmid}

        for(const [key, value] of Object.entries(newPlayer)){
            if(value == null){
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }
        PlayersService.insertPlayer(connect, newPlayer)
            .then(player => {
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${player.id}`))
                .json(serializePlayer(player))
            })
            .catch(next)
    })
    playersRouter
        .route('/:player_id')
        .all((req, res, next) => {
            const connect = req.app.get('db')
            PlayersService.getByID(connect, req.params.player_id)
                .then(player => {
                    if(!player){
                        return res
                        .status(404)
                        .json({
                            error: {message: `Player does not exist`}
                        })
                    }
                    res.player = player
                    next()
                })
                .catch(next)
        })
        .get((req, res, next) => {
            res.json(serializePlayer(res.player))
        })
        .delete((req, res, next) => {
            const connect = req.app.get('db')
            PlayersService.deletePlayer(connect, req.params.player_id)
                .then(()=> {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const connect = req.app.get('db')
            const {name, level, ac, pp, dmid } = req.body
            const playertoUpdate = {name, level, ac, pp, dmid }

            const numberOfValues = Object.values(playertoUpdate).filter(Boolean).length
            if(numberOfValues === 0){
                return res.status(400).json({
                    error: {
                        message: `Request must contain either 'name', 'level', 'AC', 'PP', or 'DmId'.`
                    }
                })
            }
            PlayersService.updatePlayer(
                connect, 
                req.params.player_id,
                playertoUpdate
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })
module.exports = playersRouter