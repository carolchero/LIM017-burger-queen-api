const Sequelize = require('sequelize');
// database, username,password
// la conexión permite crear tablas
const postgreConnection = new Sequelize('tfflabxe', 'tfflabxe', 'PwEXVZgQwRRVHrPHFuE2eMe7y0ECgz52', {
  host: 'castor.db.elephantsql.com', // lugar donde esta la base de datos
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

module.exports = {
  postgreConnection,
};
