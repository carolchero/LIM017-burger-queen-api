const Sequelize = require('sequelize');
// database, username,password
// la conexión permite crear tablas
const postgreConnection = new Sequelize('apiburguerv1', 'postgres', '123456789', {
  host: 'localhost', // lugar donde esta la base de datos
  port: 5433,
  dialect: 'postgres',
});

module.exports = {
  postgreConnection,
};
