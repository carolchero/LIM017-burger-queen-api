const dataType = require('sequelize');
const {
  postgreConnection,
} = require('../database/database');

const connection = postgreConnection;

// creando la tablita User con campos: id , email, password
const schemeTablaUser = connection.define('user', {
  id : {
    type: dataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email : {
    type: dataType.STRING,
    validate: {
      isEmail:true
    },
    unique: {
      args: true,
      msg: 'Email address already in use!',
    },
    allowNull: false
  },
  password: {
    type: dataType.STRING,
    allowNull: false
  },
  roles: {
    type: dataType.BOOLEAN,
    defaultValue: false,
  }

}, { timestamps: false });

// creando la tablita Product con campos: id, name, price, image, type, dataEntry
const schemeTablaProduct = connection.define('product', {
  id : {
    type: dataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name : {
    type: dataType.STRING,
    allowNull: false
  }, 
  price : {
    type: dataType.STRING,
    allowNull: false
  },
  image: {
    type: dataType.STRING,
    allowNull: false
  },
  type: {
    type: dataType.STRING,
    allowNull: false
  },
  dateEntry: {
    type: dataType.DATE,
    defaultValue: dataType.NOW,
  },
}, { timestamps: false });

module.exports = {
  schemeTablaUser,
  schemeTablaProduct
}
