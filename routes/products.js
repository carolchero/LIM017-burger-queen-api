const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');
const {
  schemeTablaProduct,
} = require('../models/modelScheme');

/** @module products */
module.exports = (app, nextMain) => {
  /**
   * @name GET /products
   * @description Lista productos
   * @path {GET} /products
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @header {Object} link Parámetros de paginación
   * @header {String} link.first Link a la primera página
   * @header {String} link.prev Link a la página anterior
   * @header {String} link.next Link a la página siguiente
   * @header {String} link.last Link a la última página
   * @auth Requiere `token` de autenticación
   * @response {Array} products
   * @response {String} products[]._id Id
   * @response {String} products[].name Nombre
   * @response {Number} products[].price Precio
   * @response {URL} products[].image URL a la imagen
   * @response {String} products[].type Tipo/Categoría
   * @response {Date} products[].dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   */
  app.get('/products', requireAuth, (req, resp, next) => {
    schemeTablaProduct.findAll()
      .then((data) => {
        const newFormat = data.map((product) => {
          const objectData = {
            id: product.dataValues.id,
            name: product.dataValues.name,
            price: product.dataValues.price,
            image: product.dataValues.image,
            type: product.dataValues.type,
            dateEntry: product.dataValues.dateEntry,
          };
          return objectData;
        });
        resp.status(200).json(newFormat);
      })
      .catch((error) => { resp.status(500).json({ error: error.message }); });
  });

  /**
   * @name GET /products/:productId
   * @description Obtiene los datos de un producto especifico
   * @path {GET} /products/:productId
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación
   * @response {Object} product
   * @response {String} product._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.get('/products/:productId', requireAuth, async (req, resp, next) => {
    const productIdasParm = req.params.productId;

    const foundedProduct = await schemeTablaProduct.findByPk(productIdasParm);
    if (foundedProduct) {
      return resp.status(200).json({
        id: foundedProduct.id,
        name: foundedProduct.name,
        price: foundedProduct.price,
        image: foundedProduct.image,
        type: foundedProduct.type,
        dateEntry: foundedProduct.dateEntry,
      });
    }
    resp.status(404).json({ message: 'Product not found.' });
    // req.body
    // req.params
  });

  /**
   * @name POST /products
   * @description Crea un nuevo producto
   * @path {POST} /products
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * @body {String} name Nombre
   * @body {Number} price Precio
   * @body {String} [imagen]  URL a la imagen
   * @body {String} [type] Tipo/Categoría
   * @response {Object} product
   * @response {String} products._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {400} si no se indican `name` o `price`
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es admin
   * @code {404} si el producto con `productId` indicado no existe
   */

  app.post('/products', requireAdmin, (req, resp, next) => {
    const idUserFromReq = req.body.idUser;
    const nameFromReq = req.body.name;
    const priceFromReq = req.body.price;
    const imageFromReq = req.body.image;
    const typeFromReq = req.body.type;
    const dataEntryFromReq = req.body.dataEntry;
    if (nameFromReq == null || priceFromReq == null || nameFromReq === '' || priceFromReq === '') {
      return resp.status(400).json({ message: 'Name and price must not be empty.' });
    }

    if (typeFromReq == null || typeFromReq !== 'desayuno') {
      return resp.status(400).json({ error: 'Type provided is not supported. Valid values: DESAYUNO, ALMUERZO, CENA' });
    }

    schemeTablaProduct.create({
      userId: idUserFromReq,
      name: nameFromReq,
      price: priceFromReq,
      image: imageFromReq,
      type: typeFromReq,
      dataEntry: dataEntryFromReq,
    }).then((data) => {
      resp.status(200).json({
        id: data.dataValues.id,
        name: data.dataValues.name,
        price: data.dataValues.price,
        image: data.dataValues.image,
        type: data.dataValues.type,
        dateEntry: data.dataValues.dateEntry,
      });
    })
      .catch((error) => { resp.status(500).json({ message: error.message }); });
  });

  /**
   * @name PUT /products
   * @description Modifica un producto
   * @path {PUT} /products
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @body {String} [name] Nombre
   * @body {Number} [price] Precio
   * @body {String} [imagen]  URL a la imagen
   * @body {String} [type] Tipo/Categoría
   * @response {Object} product
   * @response {String} product._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {400} si no se indican ninguna propiedad a modificar
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es admin
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.put('/products/:productId', requireAdmin, async (req, resp, next) => {
    const productIdAsParm = req.params.productId;
    const foundedProduct = await schemeTablaProduct.findByPk(productIdAsParm);
    // actualizar los campos email password y roles
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newImage = req.body.image;
    const newType = req.body.type;
    if (newName === (null || '') && newPrice === (null || '') && newImage === (null || '') && newType === (null || '')) {
      return resp.status(400).json({ error: 'No property to modify is indicated' });
    }

    if (foundedProduct) {
      try {
        foundedProduct.name = newName;
        foundedProduct.price = newPrice;
        foundedProduct.image = newImage;
        foundedProduct.type = newType;
        await foundedProduct.save();
        return resp.status(200).json({
          id: foundedProduct.id,
          name: newName,
          price: newPrice,
          image: newImage,
          type: newType,
          dateEntry: foundedProduct.dateEntry,
        });
      } catch (error) {
        return resp.status(404).json({ message: error.message });
      }
    } else {
      return resp.status(404).json({ error: 'Product not found.' });
    }
  });

  /**
   * @name DELETE /products
   * @description Elimina un producto
   * @path {DELETE} /products
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @response {Object} product
   * @response {String} product._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.delete('/products/:productId', requireAdmin, async (req, resp, next) => {
    const productIdAsParm = req.params.productId;
    const foundedProduct = await schemeTablaProduct.findByPk(productIdAsParm);
    if (foundedProduct) {
      try {
        await schemeTablaProduct.destroy({ where: { id: productIdAsParm } });
        return resp.status(200).json({ message: 'Product was deleted' });
      } catch (error) {
        resp.status(404).json({ error: 'Product was not deleted' });
      }
    }
    return resp.status(404).json({ error: 'Product not found.' });
  });

  nextMain();
};
