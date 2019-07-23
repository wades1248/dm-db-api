require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const {CLIENT_ORIGIN} = require('./config');
const playersRouter = require('./players/players-router')
const creaturesRouter = require('./creatures/creatures-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(
    cors(
))
app.use(helmet())

app.use('/api/players', playersRouter)
app.use('/api/creatures', creaturesRouter)

app.get('/api/', (req,res) => {
    res.json({ok: true})
})

app.use(function errorHandler(error, req, res,next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: {message: 'server error'}}
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app

