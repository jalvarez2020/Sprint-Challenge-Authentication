const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

insert = (user) => {
    return db('users').insert(user)
}

module.exports = {
    insert,
}
