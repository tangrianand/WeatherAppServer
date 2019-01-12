module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'weatherdb',
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'weatherdb',
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  }

}