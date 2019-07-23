const app = require('../src/app')

describe('App', () =>{
    it('GET /api/ responds with 200 containing {ok: true}'  , () => {
        return supertest(app)
            .get('/api/')
            .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
            .expect(200, {ok: true})
    })
})