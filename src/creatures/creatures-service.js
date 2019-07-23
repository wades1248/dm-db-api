const CreaturesService = {
    getAllCreatures(knex){
        return knex.select('*').from('creatures')
    }
}
module.exports = CreaturesService