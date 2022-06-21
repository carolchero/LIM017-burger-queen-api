/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
const {
  requireAuth,
} = require('../middleware/auth');

const {
  schemeTablaOrder, schemeTablaProduct, schemeTablaOrdersProduct,
} = require('../models/modelScheme');

/** @module orders */
module.exports = (app, nextMain) => {
  /**
   * @name GET /orders
   * @description Lista órdenes
   * @path {GET} /orders
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @header {Object} link Parámetros de paginación
   * @header {String} link.first Link a la primera página
   * @header {String} link.prev Link a la página anterior
   * @header {String} link.next Link a la página siguiente
   * @header {String} link.last Link a la última página
   * @auth Requiere `token` de autenticación
   * @response {Array} orders
   * @response {String} orders[]._id Id
   * @response {String} orders[].userId Id usuaria que creó la orden
   * @response {String} orders[].client Clienta para quien se creó la orden
   * @response {Array} orders[].products Productos
   * @response {Object} orders[].products[] Producto
   * @response {Number} orders[].products[].qty Cantidad
   * @response {Object} orders[].products[].product Producto
   * @response {String} orders[].status Estado: `pending`, `canceled`, `delivering` o `delivered`
   * @response {Date} orders[].dateEntry Fecha de creación
   * @response {Date} [orders[].dateProcessed] Fecha de cambio de `status` a `delivered`
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   */
  app.get('/orders/:_page/:_limit', requireAuth, (req, resp, next) => {
    const pageAsParm = req.params._page;
    const limitAsParm = req.params._limit;

    schemeTablaOrder.findAll({
      limit: limitAsParm,
      offset: pageAsParm * limitAsParm,
    })
      .then((data) => { resp.status(200).json({ orders: data }); })
      .catch((error) => { resp.status(500).json({ message: error.message }); });
  });

  /**
   * @name GET /orders/:orderId
   * @description Obtiene los datos de una orden especifico
   * @path {GET} /orders/:orderId
   * @params {String} :orderId `id` de la orden a consultar
   * @auth Requiere `token` de autenticación
   * @response {Object} order
   * @response {String} order._id Id
   * @response {String} order.userId Id usuaria que creó la orden
   * @response {String} order.client Clienta para quien se creó la orden
   * @response {Array} order.products Productos
   * @response {Object} order.products[] Producto
   * @response {Number} order.products[].qty Cantidad
   * @response {Object} order.products[].product Producto
   * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
   * @response {Date} order.dateEntry Fecha de creación
   * @response {Date} [order.dateProcessed] Fecha de cambio de `status` a `delivered`
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {404} si la orden con `orderId` indicado no existe
   */
  app.get('/orders/:orderId', requireAuth, async (req, resp, next) => {
    const orderIdasParm = req.params.orderId;

    const foundedOrder = await schemeTablaOrder.findByPk(orderIdasParm);
    if (foundedOrder) {
      return resp.status(200).json({ foundedOrder });
    }
    resp.status(404).json({ message: 'Product not found.' });
  });

  app.get('/getAllOrders', requireAuth, (req, resp, next) => {
    schemeTablaOrder.findAll({
      include: [{
        model: schemeTablaOrdersProduct,
        include: [schemeTablaProduct],
      }],
    })
      .then((order) => resp.send(order));
  });

  app.get('/getAllOrders/:_page/:_limit', requireAuth, (req, resp, next) => {
    const pageAsParm = req.params._page;
    const limitAsParm = req.params._limit;

    schemeTablaOrder.findAll({
      limit: limitAsParm,
      offset: pageAsParm * limitAsParm,
      include: [{
        model: schemeTablaOrdersProduct,
        include: [schemeTablaProduct],
      }],
    })
      .then((order) => resp.send(order));
  });

  app.get('/getAllOrders/:_idOrden', requireAuth, (req, resp, next) => {
    const pageAsParm = req.params._idOrden;
    schemeTablaOrder.findByPk(pageAsParm, {
      include: [{
        model: schemeTablaOrdersProduct, include: [schemeTablaProduct],
      }],
    }).then((order) => {
      if (order) {
        resp.status(200).json({
          id: order.id,
          client: order.client,
          products: order.ordersproducts,
          status: order.status,
          dateEntry: order.dateEntry,
        });
      }
      resp.status(404);
    });
  });

  /**
   * @name POST /orders
   * @description Crea una nueva orden
   * @path {POST} /orders
   * @auth Requiere `token` de autenticación
   * @body {String} userId Id usuaria que creó la orden
   * @body {String} client Clienta para quien se creó la orden
   * @body {Array} products Productos
   * @body {Object} products[] Producto
   * @body {String} products[].productId Id de un producto
   * @body {Number} products[].qty Cantidad de ese producto en la orden
   * @response {Object} order
   * @response {String} order._id Id
   * @response {String} order.userId Id usuaria que creó la orden
   * @response {String} order.client Clienta para quien se creó la orden
   * @response {Array} order.products Productos
   * @response {Object} order.products[] Producto
   * @response {Number} order.products[].qty Cantidad
   * @response {Object} order.products[].product Producto
   * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
   * @response {Date} order.dateEntry Fecha de creación
   * @response {Date} [order.dateProcessed] Fecha de cambio de `status` a `delivered`
   * @code {200} si la autenticación es correcta
   * @code {400} no se indica `userId` o se intenta crear una orden sin productos
   * @code {401} si no hay cabecera de autenticación
   */
  app.post('/orders', requireAuth, async (req, resp, next) => {
    const userIdFromReq = req.body.userId;
    const clientFromReq = req.body.client;
    const statusFromReq = req.body.status;
    const listOfProducts = req.body.products;

    // para crear un orderProducts primero necesitamos una orden!! entonces la creamos
    schemeTablaOrder.create({
      userId: userIdFromReq,
      client: clientFromReq,
      status: statusFromReq,
    }).then((createdOrder) => {
      for (const item of listOfProducts) {
        // aqui para insertar un orderProducts necesitamos una orderId, un productId y una cantidad.
        schemeTablaOrdersProduct.create({
          orderId: createdOrder.id,
          productId: item.productid,
          quantity: item.qty,
        });
      }
      schemeTablaOrder.findByPk(createdOrder.id, {
      }).then((order) => {
        order ? resp.status(200).json({ order }) : resp.status(404);
      });
    });
  });
  /**
   * @name PUT /orders
   * @description Modifica una orden
   * @path {PUT} /products
   * @params {String} :orderId `id` de la orden
   * @auth Requiere `token` de autenticación
   * @body {String} [userId] Id usuaria que creó la orden
   * @body {String} [client] Clienta para quien se creó la orden
   * @body {Array} [products] Productos
   * @body {Object} products[] Producto
   * @body {String} products[].productId Id de un producto
   * @body {Number} products[].qty Cantidad de ese producto en la orden
   * @body {String} [status] Estado: `pending`, `canceled`, `delivering` o `delivered`
   * @response {Object} order
   * @response {String} order._id Id
   * @response {String} order.userId Id usuaria que creó la orden
   * @response {Array} order.products Productos
   * @response {Object} order.products[] Producto
   * @response {Number} order.products[].qty Cantidad
   * @response {Object} order.products[].product Producto
   * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
   * @response {Date} order.dateEntry Fecha de creación
   * @response {Date} [order.dateProcessed] Fecha de cambio de `status` a `delivered`
   * @code {200} si la autenticación es correcta
   * @code {400} si no se indican ninguna propiedad a modificar o la propiedad `status` no es valida
   * @code {401} si no hay cabecera de autenticación
   * @code {404} si la orderId con `orderId` indicado no existe
   */
  app.put('/orders/:orderId', requireAuth, async (req, resp, next) => {
    const orderIdAsParam = req.params.orderId;
    const foundedOrder = await schemeTablaOrder.findByPk(orderIdAsParam);
    // actualizar los campos email password y roles
    const newClient = req.body.client;
    const newStatus = req.body.status;
    const newProducts = req.body.products;
    const newdateProcessed = req.body.dateProcessed;
    const newDateEntry = req.body.dateEntry;

    if (foundedOrder) {
      try {
        foundedOrder.client = newClient;
        foundedOrder.status = newStatus;
        foundedOrder.products = newProducts;
        foundedOrder.dateProcessed = newdateProcessed;
        foundedOrder.dateEntry = newDateEntry;
        await foundedOrder.save();
        return resp.status(200).json({ message: 'Order updated successfully.' });
      } catch (error) {
        return resp.status(404).json({ message: error.message });
      }
    } else {
      return resp.status(404).json({ message: 'Order not found.' });
    }
  });

  /**
   * @name DELETE /orders
   * @description Elimina una orden
   * @path {DELETE} /orders
   * @params {String} :orderId `id` del producto
   * @auth Requiere `token` de autenticación
   * @response {Object} order
   * @response {String} order._id Id
   * @response {String} order.userId Id usuaria que creó la orden
   * @response {String} order.client Clienta para quien se creó la orden
   * @response {Array} order.products Productos
   * @response {Object} order.products[] Producto
   * @response {Number} order.products[].qty Cantidad
   * @response {Object} order.products[].product Producto
   * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
   * @response {Date} order.dateEntry Fecha de creación
   * @response {Date} [order.dateProcessed] Fecha de cambio de `status` a `delivered`
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {404} si el producto con `orderId` indicado no existe
   */
  app.delete('/orders/:orderId', requireAuth, async (req, resp, next) => {
    const orderIdAsParm = req.params.orderId;
    const foundedOrder = await schemeTablaOrder.findByPk(orderIdAsParm);
    if (foundedOrder) {
      try {
        await schemeTablaOrder.destroy({ where: { id: orderIdAsParm } });
        return resp.status(200).json({ message: 'Order was deleted' });
      } catch (error) {
        resp.status(404).json({ message: 'Order was not deleted' });
      }
    }
    return resp.status(404).json({ message: 'Order not found.' });
  });

  nextMain();
};
