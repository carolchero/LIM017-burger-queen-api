const jwt = require('jsonwebtoken');
const config = require('../config');
const {
  schemeTablaUser,
} = require('../models/modelScheme');
const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', async (req, resp, next) => {
    const emailFromReq = req.body.email;
    const passwordFromReq = req.body.password;

    const conditionToLogin = await schemeTablaUser.findOne(
      { where: { email: emailFromReq, password: passwordFromReq } },
    );
    if (conditionToLogin) {
      return resp.status(200).json({ data: conditionToLogin.dataValues });
    }
    resp.status(500).json({ message: 'user is not exist' });
    // TODO: autenticar a la usuarix
    next();
  });

  return nextMain();
};
