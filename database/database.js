const Sequelize = require('sequelize');
// database, username,password
const postgreConnection = new Sequelize('apiburguerv1', 'postgres', '123456', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres'
});

module.exports = {
  postgreConnection,
};
