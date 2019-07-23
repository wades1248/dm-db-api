const express = require('express')
const CreaturesService = require('./creatures-service')
const xss = require('xss')
const creaturesRouter = express.Router()

const serializeCreature = creature => ({
    id: creature.id, 
    name: xss(creature.name), 
    ac: creature.ac,
    xp: creature.xp,
    cr: creature.cr,
    dexmod: creature.dexmod,
    source: xss(creature.source),
    artic: creature.artic, 
    coastal: creature.coastal,
    desert: creature.desert, 
    forest: creature.forest, 
    grasslands: creature.grasslands, 
    hill: creature.hill, 
    mountain: creature.mountain, 
    swamp: creature.swamp, 
    underdark: creature.underdark, 
    underwater: creature.underwater,
    urban: creature.urban

})
creaturesRouter
    .route('/')
    .get((req, res, next) => {
        const connect = req.app.get('db')
        CreaturesService.getAllCreatures(connect)
            .then(creatures =>{
                res.json(creatures.map(serializeCreature))
            })
            .catch(next)
    })
module.exports = creaturesRouter