const PlayersService = {
    getAllPlayers(knex){
        return knex.select('*').from('players')
    },
    insertPlayer(knex, newPlayer){
        return knex
            .insert(newPlayer)
            .into('players')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getByID(knex, id){
        return knex
            .from('players')
            .select('*').where('id', id).first()
    },
    getByDmID(knex, dmid){
        return knex
            .select('*').where('dmid', dmid)
            .from('players')
    },
    deletePlayer(knex, id){
        return knex('players')
            .where({id})
            .delete()
    },
    updatePlayer(knex, id, newPlayerFields){
        return knex('players')
        .where(({id}))
        .update(newPlayerFields)
    }
}
module.exports = PlayersService