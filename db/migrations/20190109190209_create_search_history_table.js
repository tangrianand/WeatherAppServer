
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('search_history', function (table) {
          table.uuid('id').primary()
          table.uuid('user_id').notNullable().references('id').inTable('user')
          table.string('location', 255).notNullable()
          table.string('weather', 255)
          table.datetime('created_at')
          table.datetime('updated_at')
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.raw('SET FOREIGN_KEY_CHECKS=0'),
    
        knex.schema.dropTable('search_history'),
    
        knex.schema.raw('SET FOREIGN_KEY_CHECKS=1')
      ])
};
