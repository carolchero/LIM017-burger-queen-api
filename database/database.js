const Sequelize = require('sequelize');
// database, username,password
// la conexión permite crear tablas
<<<<<<< HEAD
const postgreConnection = new Sequelize('apiburguerv1', 'postgres', '123456789', {
  host: 'localhost', // lugar donde esta la base de datos
  port: 5433,
=======
const postgreConnection = new Sequelize('apiburguerv1', 'postgres', '123456', {
  host: 'localhost', // lugar donde esta la base de datos
  port: 5432,
>>>>>>> 7cff662660565403b2612f4dd13b71a3c3372a9b
  dialect: 'postgres',
  logging: false,
});

module.exports = {
  postgreConnection,
};
