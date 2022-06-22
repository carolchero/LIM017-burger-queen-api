const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const {
  schemeTablaUser,
} = require('../models/modelScheme');

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

    if (emailFromReq == null || passwordFromReq == null || emailFromReq === '' || passwordFromReq === '') {
      return resp.status(400).json({ message: 'Email and password must not be empty.' });
    }

    const foundedUser = await schemeTablaUser.findOne(
      { where: { email: emailFromReq } },
    );

    if (foundedUser) {
      // comparamos password desde request con password encriptado en la bd
      const validPassword = await bcrypt.compare(passwordFromReq, foundedUser.password);
      if (validPassword) {
        // generar token
        // datos para token
        const payload = {
          email: emailFromReq,
          roles: foundedUser.roles,
        };
        // jwv recibe la data a guardar, palabras clave y el tiempo de duración.
        const token = jwt.sign(payload, config.secret, {
          expiresIn: config.access_token_life_in_seconds,
        });

        return resp.status(200).json({ accessToken: token });
      }
      return resp.status(404).json({ message: 'Credentials are invalid.' });
    }
    resp.status(404).json({ message: 'User does not exist.' });
    // TODO: autenticar a la usuarix
    next();
  });

  return nextMain();
};