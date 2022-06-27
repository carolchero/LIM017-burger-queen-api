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
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
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
  dateEntry: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: false });

const schemeTablaOrdersProduct = connection.define('ordersproduct', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, { timestamps: false });

// el usuario puede tener muchas ordenes
schemeTablaUser.hasOne(schemeTablaOrder, {
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

// insert data por defecto
/* connection.sync({ force: true }).then(() => {
  schemeTablaUser.create({
    email: 'admin@gmail.com',
    password: '$2b$10$bhOcgMtXGtqiwdMOh1EZHuydzdr0tcwT/bgjVONRzrzmPZ5MRMdKC',
    // eslint-disable-next-line object-curly-newline
    roles: true });
  schemeTablaUser.create({
    email: 'noadmin@gmail.com',
    password: '$2b$10$bhOcgMtXGtqiwdMOh1EZHuydzdr0tcwT/bgjVONRzrzmPZ5MRMdKC',
    // eslint-disable-next-line object-curly-newline
    roles: false });
  schemeTablaProduct.create({
    name: 'mango',
    price: 10.00,
    image: 'http://image.fake1',
    type: 'DESAYUNO',
  });
  schemeTablaProduct.create({
    name: 'pera',
    price: 12.00,
    image: 'http://image.fake2',
    type: 'DESAYUNO',
  });
  schemeTablaProduct.create({
    name: 'nabo',
    price: 5.00,
    image: 'http://image.fake3',
    type: 'DESAYUNO',
  });
}); */

schemeTablaOrdersProduct.belongsTo(schemeTablaProduct, { foreingKey: 'productId' });
schemeTablaProduct.hasMany(schemeTablaOrdersProduct, { foreingKey: 'productId' });

schemeTablaOrdersProduct.belongsTo(schemeTablaOrder, { foreingKey: 'orderId' });
schemeTablaOrder.hasMany(schemeTablaOrdersProduct, { foreingKey: 'orderId' });

module.exports = {
  schemeTablaUser,
  schemeTablaProduct,
  schemeTablaOrder,
  schemeTablaOrdersProduct,
};
// Task.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
