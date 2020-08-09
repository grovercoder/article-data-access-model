const knexfile = require('../../knexfile.js')
const config = knexfile[process.env.NODE_ENV || 'development']
const knex = require('knex')(config)

module.exports = knex
