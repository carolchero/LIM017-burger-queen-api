/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');

const request = supertest(app);

const adminUserCorrect = {
  email: 'admin@gmail.com',
  password: '123456',
};
const noAdminUser = {
  email: 'noadmin@gmail.com',
  password: '123456789',
};

const productCorrect = {
  name: 'hamburguesa simple',
  price: '10',
  image: 'hamburguesa.png',
  type: 'desayuno',
};

const productWithoutPrice = {
  name: 'hamburguesa simple',
  price: '',
  image: 'hamburguesa.png',
  type: 'desayuno',
};

const productWithoutValues = {
  name: '',
  price: '',
  image: '',
  type: '',
};
const productDoesNotExist = {
  name: 'martillo',
  price: '80',
  image: 'sin image',
  type: 'ferreteria',
};

describe('GET /products', () => {
  it('responds with error 401 when user is not authenticated', (done) => {
    request
      .get('/products')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
    done();
  });
  it('should return a statusCode 200 and array when get all products', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/products').set('access-token', `${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return a statusCode 200 and one product when get product by id', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/products/1').set('access-token', `${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeFalsy();
          done();
        });
    });
  });
  it('should return a error 404 when product not found', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/products/0').set('access-token', `${token}`).then((response) => {
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toBe('Product not found.');
        done();
      });
    })
      .catch((error) => { resp.status(500).json({ error: error.message }); });
  });
});

describe('POST/products', () => {
  it('responds with error 401 when user is not authenticated', (done) => {
    request
      .post('/products')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
    done();
  });
  it('should return a statusCode 200 when create new products', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      const token = resp.body.accessToken;
      request.post('/products').set('access-token', `${token}`)
        .send(productCorrect)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBeTruthy();
          expect(response.body.price).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });

  it('should return a error 400 when Name and price must not be empty', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      const token = resp.body.accessToken;
      request.post('/products').set('access-token', `${token}`)
        .send(productWithoutPrice)
        .then((response) => {
          expect(response.statusCode).toEqual(400);
          expect(response.body.message).toBe('Name and price must not be empty.');
          done();
        });
    });
  });

  it('should return 400 when name or price is missing', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/products').set('Authorization', `Bearer ${token}`)
        .send({ name: 'algo' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Name or Price is missing2' });
          done();
        });
    })
      .catch((error) => { resp.status(500).json({ message: error.message }); });
  });
});

/*describe('PUT/products', () => {
  it('responds with error 401 when user is not authenticated', (done) => {
    request
      .put('/products')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
    done();
  });
  it('should return a statusCode 200 and array when get all products', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      const token = resp.body.accessToken;
      request.put('/products/').set('access-token', `${token}`)
        .send(productCorrect)
        .expect('Content-Type', /json/)
        .expect(200);
      done();
    });
  });
});*/

describe('PUT/products', () => {
  it('should return a error 404 when product not found', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/products/0').set('access-token', `${token}`).then((response) => {
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toBe('Product not found.');
        done();
      });
    })
      .catch((error) => { resp.status(500).json({ error: error.message }); });
  });
  it('should return 403 when is not admin', (done) => {
    request.post('/auth').send(noAdminUser).then((response) => {
      const token = response.body.accessToken;
      request.get('/products/0').set('access-token', `${token}`).then((response) => {
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toBe('client not admin.');
        done();
      });
    });
  });
  it('should return 400 when typeof of price is not number', (done) => {
    request.post('/auth').send(adminUserCorrect).then((response) => {
      const token = response.body.accessToken;
      request.get('/products/0').set('access-token', `${token}`).then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body).toBe({ message: 'typeof of price is not a number' });
        done();
      });
    });
  });
  it('should return 200 when product is updated', (done) => {
    request.post('/auth').send(adminUserCorrect).then((response) => {
      const token = resp.body.accessToken;
      request.get('/products/0').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect((response.body.foundedOrder.userId)).toBeTruthy();
          expect((response.body.foundedOrder.client)).toBeTruthy();
          expect((response.body.foundedOrder.status)).toBeTruthy();
          done();
        });
    });
  });
  it('should return 400 when properties not found', (done) => {
    request.post('/auth').send(adminUserCorrect).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
              expect(response.body).toEqual({ message: 'Properties not found' });
              done();
            });
        });
    });
  });
});

describe('DELETE/products', () => {
  it('should edit orders by id', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.delete(`/products/${idOrders}`)
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.message).toBe('Products was deleted');
          done();
        });
    });
  });
  it('should return an error 404 if orders not exist', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.delete('/products/0')
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(404);
          expect(response.body.message).toEqual('Products not found.');
          done();
        });
    });
  });
});
