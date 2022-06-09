const { DataTypes } = require('sequelize');
const {
  postgreConnection,
} = require('../database/database');

const connection = postgreConnection;

// creando la tablita User con campos: id , email, password
const schemeTablaUser = connection.define('user', {
  id: {
    type: DataTypes.INTEGER, // tipo de dato
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
    unique: {
      args: true,
      msg: 'Email address already in use!',
    },
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // valor por defecto
  },

}, { timestamps: false });

// creando la tablita Product con campos: id, name, price, image, type, dataEntry
const schemeTablaProduct = connection.define('product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateEntry: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: false });

// creando tabla de orders
const schemeTablaOrder = connection.define('order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  client: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  products: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateProcessed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  dateEntry: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: false });

// el usuario puede tener muchas ordenes
schemeTablaUser.hasMany(schemeTablaOrder, {
  foreingKey: 'userId',
  sourceKey: 'id',
}/* { foreignKey: { allowNull: false }} */);

// la tabla order pertenece a usuario
schemeTablaOrder.belongsTo(schemeTablaUser, {
  foreingKey: 'userId',
  targetId: 'id',
/*   foreingKey: {
    name: 'idUser',
    allowNull: false,
  }, */
});

module.exports = {
  schemeTablaUser,
  schemeTablaProduct,
  schemeTablaOrder,
};
// Task.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
