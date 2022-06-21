const bcrypt = require('bcrypt');
const {
  schemeTablaUser,
} = require('../models/modelScheme');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers,
} = require('../controller/users');
const { password } = require('pg/lib/defaults');

const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };

  // TODO: crear usuaria admin
  next();
};

/*
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */

/** @module users */
module.exports = (app, next) => {
  /**
   * @name GET /users
   * @description Lista usuarias
   * @path {GET} /users
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @header {Object} link Parámetros de paginación
   * @header {String} link.first Link a la primera página
   * @header {String} link.prev Link a la página anterior
   * @header {String} link.next Link a la página siguiente
   * @header {String} link.last Link a la última página
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * @response {Array} users
   * @response {String} users[]._id
   * @response {Object} users[].email
   * @response {Object} users[].roles
   * @response {Boolean} users[].roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin
   */
  app.get('/users', requireAdmin, getUsers);

  /**
   * @name GET /users/:uid
   * @description Obtiene información de una usuaria
   * @path {GET} /users/:uid
   * @params {String} :uid `id` o `email` de la usuaria a consultar
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin** o la usuaria a consultar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o la misma usuaria
   * @code {404} si la usuaria solicitada no existe
   */
  app.get('/users/:uid', requireAuth, async (req, resp) => {
    const userIdAsParm = req.params.uid;

    const foundedUser = await schemeTablaUser.findByPk(userIdAsParm);
    if (foundedUser) {
      return resp.status(200).json({
        id: foundedUser.id,
        email: foundedUser.email,
        password: foundedUser.password,
        roles: {
          admin: foundedUser.roles,
        },
      });
    }
    return resp.status(404).json({ error: 'User not found.' });
  });

  /**
   * @name POST /users
   * @description Crea una usuaria
   * @path {POST} /users
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @body {Object} [roles]
   * @body {Boolean} [roles.admin]
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si ya existe usuaria con ese `email`
   */
  app.post('/users', async (req, resp, next) => {
    const emailFromReq = req.body.email;
    const passwordFromReq = req.body.password;
    const rolesFromReq = req.body.roles;
    if (emailFromReq == null || passwordFromReq == null || emailFromReq === '' || passwordFromReq === '') {
      return resp.status(400).json({ message: 'Email and password must not be empty.' });
    }
    // guardar password encriptado al crear y guardar un nuevo user
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(passwordFromReq, salt);

    schemeTablaUser.create({
      email: emailFromReq,
      password: encryptedPassword,
      roles: rolesFromReq,
    }).then((data) => {
      resp.status(200).json({
        id: data.dataValues.id,
        email: data.dataValues.email,
        password: data.dataValues.password,
        roles: {
          admin: data.dataValues.roles,
        },
      });
    })
      .catch((error) => { resp.status(403).json({ error: error.message }); });
  });

  /**
   * @name PUT /users
   * @description Modifica una usuaria
   * @params {String} :uid `id` o `email` de la usuaria a modificar
   * @path {PUT} /users
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @body {Object} [roles]
   * @body {Boolean} [roles.admin]
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin** o la usuaria a modificar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o la misma usuaria
   * @code {403} una usuaria no admin intenta de modificar sus `roles`
   * @code {404} si la usuaria solicitada no existe
   */
  app.put('/users/:uid', requireAdmin, async (req, resp, next) => {
    const userIdAsParm = req.params.uid; // id
    const foundedUser = await schemeTablaUser.findByPk(userIdAsParm);
    // actualizar los campos email password y roles
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    const newRoles = req.body.roles;
    if (newEmail == null || newPassword == null || newEmail === '' || newPassword === '') {
      return resp.status(400).json({ message: 'Email and password must not be empty.' });
    }
    if (foundedUser) {
      try {
        foundedUser.email = newEmail;
        foundedUser.password = newPassword;
        foundedUser.roles = newRoles;

        await foundedUser.save();
        return resp.status(200).json({
          id: foundedUser.dataValues.id,
          email: newEmail,
          password: newPassword,
          roles: {
            admin: newRoles,
          },
        });
      } catch (error) {
        return resp.status(500).json({ error: error.message });
      }
    } else {
      return resp.status(404).json({ error: 'User not found.' });
    }
  });

  /**
   * @name DELETE /users
   * @description Elimina una usuaria
   * @params {String} :uid `id` o `email` de la usuaria a modificar
   * @path {DELETE} /users
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin** o la usuaria a eliminar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o la misma usuaria
   * @code {404} si la usuaria solicitada no existe
   */
  app.delete('/users/:uid', requireAuth, async (req, resp, next) => {
    const userIdAsParm = req.params.uid;
    const foundedUser = await schemeTablaUser.findByPk(userIdAsParm);
    if (foundedUser) {
      try {
        // metodo destroy elimina/ en where se especifica el id
        await schemeTablaUser.destroy({ where: { id: userIdAsParm } });
        return resp.status(200).json({ message: 'User was deleted' });
      } catch (error) {
        return resp.status(404).json({ error: 'User was not deleted' });
      }
    }
    return resp.status(404).json({ error: 'User not found.' });
  });

  initAdminUser(app, next);
};





/*const {
  schemeTablaUser,
} = require('../models/modelScheme');

module.exports = {
  getUsers: (req, resp, next) => {
    console.log('access-token: ', req.headers['access-token']);
    // findAll metodo que recorre filas y retorna los arreglos
    schemeTablaUser.findAll()
      .then((data) => {
        const newFormat = data.map((user) => {
          const objectData = {
            id: user.dataValues.id,
            email: user.dataValues.email,
            password: user.dataValues.password,
            roles: {
              admin: user.dataValues.roles,
            },
          };
          return objectData;
        });
        resp.status(200).json(newFormat);
      })
      .catch((error) => { resp.status(500).json({ error: error.message }); });
  },
};*/
