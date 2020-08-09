exports.up = function (knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id')
    table.integer('group_id')
    table.string('name', 50)
    table.string('public_code')
    table.boolean('completed')
    table.string('description', 2000)
    table.timestamp('created_at')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('tasks')
}
