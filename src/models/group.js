const knex = require('./_connection.js')
const Model = require('./_model.js')({
  knex,
  tablename: 'groups',
  schema: {
    title: 'groups',
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  guarded: [],
})

// Our group model is basic and does not need anything
// other than what our `_model.js` module provides
module.exports = Model
