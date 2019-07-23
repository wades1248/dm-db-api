const app = require('../src/app')
const knex = require('knex')
const {makePlayersArray, makeMaliciousPlayer} = require('./players.fixtures')

describe(`players endpoints`, function(){
    let db 

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })
    after('disconnect from the db', () => db.destroy())
    before('clean the table', () => db('players').truncate())
    afterEach('cleanup', () => db('players').truncate())

    describe(`GET /creatures`, () => {
        context(`given no players`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/creatures')
                    .expect(200, [])
            })
        })
    })

    describe(`GET /players`, () => {
        context(`given no players`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/players')
                    .expect(200, [])
            })
        })
        context(`given that there are players in the db`, () => {
            const testPlayers= makePlayersArray()
            beforeEach(`instsert players`, () => {
                return db
                    .into('players')
                    .insert(testPlayers)
            })
            it(`responds 200 with all players`, () => {
                return supertest(app)
                    .get('/api/players')
                    .expect(200, testPlayers)
            })
        })
        context(`Given an XSS attack player`, () => {
            const {maliciousPlayer, expectedPlayer} = makeMaliciousPlayer()

            beforeEach('insert malicious player', () => {
                return db
                    .into('players')
                    .insert([maliciousPlayer])
            })
            it(`removes XSS attack content`, () => {
                return supertest(app)
                    .get('/api/players')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedPlayer.name)
                        expect(res.body[0].dmid).to.eql(expectedPlayer.dmid)
                    })
            })
        })
    })
    describe(`GET 'players/:id'`, () => {
        context(`given no players`, () => {
            it(`responds 404`, () => {
                const testId = 9990303
                return supertest(app)
                    .get(`/api/players/${testId}`)
                    .expect(404)
            })
        })
        context(`Provided with players`, () => {
            const testPlayers = makePlayersArray()
            beforeEach('insert players', () => {
                return db
                    .into('players')
                    .insert(testPlayers)
            })
            it(`responds 200 with the desired player`, () => {
                const testId = 2
                const expectedPlayer = testPlayers[testId-1]
                return supertest(app)
                    .get(`/api/players/${testId}`)
                    .expect(200, expectedPlayer)
            })
        })
    })
    describe(`POST /players`, () => {
        it(`creates a new player responding with 201 and the new player`, ()=> {
            const newPlayer = {
                name: 'new',
                level: 4,
                ac: 20,
                pp: 18,
                dmid: 'party'
            }
            return supertest(app)
                .post('/api/players/')
                .send(newPlayer)
                .expect(201)
                .expect( res => {
                    expect(res.body.name).to.eql(newPlayer.name)
                    expect(res.body.level).to.eql(newPlayer.level)
                    expect(res.body.ac).to.eql(newPlayer.ac)
                    expect(res.body.pp).to.eql(newPlayer.pp)
                    expect(res.body.dmid).to.eql(newPlayer.dmid)
                    expect(res.headers.location).to.eql(`/api/players/${res.body.id}`)
                })
                .then(postRes => 
                    supertest(app)
                        .get(`/api/players/${postRes.body.id}`)
                        .expect(postRes.body)
                    )
        })
        const requiredFields = ['name', 'level', 'ac', 'pp', 'dmid']
        requiredFields.forEach(field => {
            const newPlayer = {
                name: 'new',
                level: 4,
                ac: 20,
                pp: 18,
                dmid: 'party'
            }
            it(`responds with 400 when ${field} is missing`, ()=> {
                delete newPlayer[field]

                return supertest(app)
                    .post('/api/players/')
                    .send(newPlayer)
                    .expect(400)
            })
        })
    })
    describe(`DELETE /players/:player_id`, () => {
        context(`Given no players`, () => {
            it(`responds with 404 and n error`, () => {
                const playerId = 4444
                return supertest(app)
                    .delete(`/ap/players/${playerId}`)
                    .expect(404)
            })
        })
        context(`given there are players in db`, () => {
            const testPlayers = makePlayersArray()
            beforeEach(`insert players`, () => {
                return db
                    .into('players')
                    .insert(testPlayers)
            })
            it(`Responds with 204 and removes the bookmark`, () => {
                const idToRemove = 2
                const expectedPlayers = testPlayers.filter(player => player.id !== idToRemove)

                return supertest(app)
                    .delete(`/api/players/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get(`/api/players/`)
                        .expect(expectedPlayers)
                        )
            })
        })
    })
    describe(`PATCH /api/players/:player_id`, () => {
        context(`Given that there are no players in the db`, () => {
            it(`responds with 404`, () => {
                const playerId = 4444
                return supertest(app)
                    .patch(`/api/players/${playerId}`)
                    .expect(404)

            })
        })
        context(`Given there are players in the DB`, () => {
            const testPlayers = makePlayersArray()
            beforeEach(`insert into players`, () => {
                return db
                    .into('players')
                    .insert(testPlayers)
            })
            it(`responds with 204 and updates the players`, () => {
                const playerId = 2
                const updatePlayer = {
                    name: 'new',
                    level: 5,
                    ac: 20,
                    pp: 17,
                    dmid: 'new'
                }
                const expectedPlayer = {
                    ...testPlayers[playerId-1],
                    ...updatePlayer
                }
                return supertest(app)
                    .patch(`/api/players/${playerId}`)
                    .send({
                        ...updatePlayer
                    })
                    .expect(204)
                    .then(res =>
                            supertest(app)
                                .get(`/api/players/${playerId}`)
                                .expect(expectedPlayer)
                        )
            })
            it(`responds 400 when no required fields are supplied`, () => {
                const playerID = 2
                return supertest(app)
                    .patch(`/api/players/${playerID}`)
                    .send({fakeField: 'nope'})
                    .expect(400)
            })
            it(`Responds 204 when only a subset of fields is supplied`, () => {
                const playerID = 2
                const updatePlayer = {
                    name: 'success'
                }
                const expectedPlayer = {
                    ...testPlayers[playerID -1],
                    ...updatePlayer
                }
                return supertest(app)
                    .patch(`/api/players/${playerID}`)
                    .send({
                        ...updatePlayer,
                        fieldToIgnore: 'should not be there'
                    })
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/players/${playerID}`)
                            .expect(expectedPlayer)
                        )
            })
        })
    })
})