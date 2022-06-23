const express = require('express');
// eslint-disable-next-line import/no-unresolved
// const pg = require('pg');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

// const pgClient = new pg.Client({ connectionString: config.dbUrl });

const { port, dbUrl, secret } = config;
const app = express(); // usando funcion de express para crear rutas

// TODO: Conexión a la Base de Datos (MongoDB o MySQL)
const {
  postgreConnection,
} = require('./database/database');

const connection = postgreConnection;

// llamando a modelos
const scheme = require('./models/modelScheme');

try {
  connection.authenticate();
  console.log('Connection has been established successfully.');
  //connection.sync({ alter: true }); // sincronizacion con base de datos
  // force(elimina anteriores) alter: añade cambios
} catch (error) {
  console.error('Unable to connect to the database..Ending backend:', error);
}
app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // para que el servidor interprete formato json
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});

module.exports = app;
/* pgClient.connect();
pgClient.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pgClient.end();
});
 */
module.export = {
  app,
};
