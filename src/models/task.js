const knex = require('./_connection.js')
const Model = require('./_model.js')({
  knex,
  tablename: 'tasks',
  schema: {
    title: 'tasks',
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      group_id: { type: 'integer' },
      public_code: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      completed: { type: 'boolean' },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
  guarded: ['public_code'],
})

// EXAMPLE of overwriting a core method
// Here we want the normal create routine called unless
// the passed in name is 'task' or 'run'.  In those cases
// we want to do something a little different.
// ALSO, we need to create that public_code value we are using as an example.
const core_create = Model.create
Model.create = async (data) => {
  if (data.name) {
    if (data.name.toLowerCase() == 'task') {
      throw new Error('Invalid Task Name')
    }
    if (data.name.toLowerCase() == 'run') {
      data.name = 'automated task'
    }
  }

  data.public_code = 'SOME RANDOM VALUE'

  await core_create(data)
}

// EXAMPLE of adding a method specific to this model only
Model.complete = async (id) => {
  const updateData = {
    id,
    completed: true,
  }
  return await Model.update(updateData)
}

// EXAMPLE of adding a method that updates the data directly
Model.completeAll = async () => {
  await knex('tasks').update({ completed: true })
}

module.exports = Model
