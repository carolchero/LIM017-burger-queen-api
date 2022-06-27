const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');

const request = supertest(app);

const adminUserCorrect = {
  email: 'admin@gmail.com',
  password: '123456',
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
    });
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
        .expect(200);
      done();

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
});

describe('PUT/products', () => {
    it('responds with error 401 when user is not authenticated', (done) => {
      request
        .put('/products')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401);
      done();
    });
/*     it('should return a statusCode 200 and array when get all products', (done) => {
      request.post('/auth').send(adminUserCorrect).then((resp) => {
        const token = resp.body.accessToken;
        request.put('/products/').set('access-token', `${token}`)
          .send(productCorrect)
          .expect('Content-Type', /json/)
          .expect(200);
        done();
      });
    });
  
    it('should return a error 404 when product not found', (done) => {
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
    }); */
  });

