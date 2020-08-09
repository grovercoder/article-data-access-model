exports.up = function (knex) {
  return knex.schema.createTable('groups', (table) => {
    table.increments('id')
    table.string('name', 50)
    table.timestamp('created_at')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('groups')
}
