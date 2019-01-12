
exports.up = function(knex, Promise) {
	return Promise.all([
    knex.schema.createTable('user', function (table) {
      table.uuid('id').primary()
      table.string('name', 255).notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('password', 255).notNullable()
      table.string('mobile', 50).notNullable()
      table.string('city').notNullable()
      table.string('country').notNullable()
      table.datetime('created_at')
      table.datetime('updated_at')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('SET FOREIGN_KEY_CHECKS=0'),

    knex.schema.dropTable('user'),

    knex.schema.raw('SET FOREIGN_KEY_CHECKS=1')
  ])
};
