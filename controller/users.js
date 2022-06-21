/* eslint-disable indent */
/* eslint-disable no-console */
const {
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

};
