const {
  schemeTablaProduct,
} = require('../models/modelScheme');

module.exports = {
  getProducts: (req, resp, next) => {
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
  },
  getProductId: async (req, resp, next) => {
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
  },
  postProducts: (req, resp, next) => {
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
  },

  putProducts: async (req, resp, next) => {
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
  },
  deleteProducts: async (req, resp, next) => {
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
  },
};
