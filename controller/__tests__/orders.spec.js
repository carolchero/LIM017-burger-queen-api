const supertest = require('supertest');
const app = require('../../server');

const request = supertest(app);

const adminUser = {
  email: 'admin@gmail.com',
  password: '123456',
};

const orders = {
  userId: 1,
  client: 'Maria',
  status: 'pending',
  products: [
    {
      qty: 1,
      productid: 1,
    },
    {
      qty: 1,
      productid: 2,
    },
  ],
};

const ordersError = {
  userId: 0,
  client: 'Maria',
  status: 'pending',
  products: [
    {
      qty: 1,
      productid: 1,
    },
    {
      qty: 1,
      productid: 2,
    },
  ],
};

let idOrders = '';

describe('POST ORDERS', () => {
  it('should post create orders', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.post('/orders').set('access-token', `${token}`)
        .send(orders)
        .then((response) => {
          idOrders = response.body.order.id;
          expect(response.status).toEqual(200);
          expect((response.body.order.id)).toBeTruthy();
          expect((response.body.order.client)).toBeTruthy();
          expect((response.body.order.status)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 404 if not create orders', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.post('/orders').set('access-token', `${token}`)
        .send(ordersError)
        .then((response) => {
          expect(response.status).toEqual(404);
          expect(response.body.error).toBeTruthy();
          done();
        });
    });
  });

  it('should return an error 401 if not exist token', (done) => {
    request.post('/orders')
      .send(orders)
      .then((response) => {
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('GET ORDERS', () => {
  it('should get orders collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/orders/0/1').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body.orders)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.get('/orders/0/1')
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('GET ORDERS BY ID', () => {
  it('should get orders collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get(`/orders/${idOrders}`).set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect((response.body.foundedOrder.userId)).toBeTruthy();
          expect((response.body.foundedOrder.client)).toBeTruthy();
          expect((response.body.foundedOrder.status)).toBeTruthy();
          done();
        });
    });
  });
  it('should get orders collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/orders/0').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(404);
          expect(response.body.message).toBe('Product not found.');
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.get(`/orders/${idOrders}`)
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('GET ALL ORDERS PAGE LIMIT', () => {
  it('should get all orders collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/getAllOrders').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.get('/getAllOrders')
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('GET ALL ORDERS', () => {
  it('should get all orders collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/getAllOrders').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.get('/getAllOrders')
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('GET ALL ORDERS PAGE LIMIT', () => {
  it('should get all orders collection by page and limit', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/getAllOrders/0/1').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.get('/getAllOrders/0/1')
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('GET ALL ORDERS BY ID', () => {
  it('should get all orders collection by id', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get(`/getAllOrders/${idOrders}`).set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect((response.body.id)).toBeTruthy();
          expect((response.body.client)).toBeTruthy();
          expect((response.body.status)).toBeTruthy();
          expect((response.body.products)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.get(`/getAllOrders/${idOrders}`)
      .then((response) => {
        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('PUT ORDERS', () => {
  it('should edit orders by id', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.put(`/orders/${idOrders}`)
        .set('access-token', `${token}`)
        .send(orders)
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.message).toBe('Order updated successfully.');
          done();
        });
    });
  });
  it('should return an error 404 if orders not exist', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.put('/orders/0')
        .set('access-token', `${token}`)
        .send(orders)
        .then((response) => {
          expect(response.statusCode).toEqual(404);
          expect(response.body.message).toEqual('Order not found.');
          done();
        });
    });
  });
  it('should return an error 404 if data must not be empty', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.put(`/orders/${idOrders}`)
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(404);
          expect((response.body.error)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 if not token ', (done) => {
    request.put(`/orders/${idOrders}`)
      .then((response) => {
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('DELETE ORDERS', () => {
  it('should edit orders by id', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.delete(`/orders/${idOrders}`)
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.message).toBe('Order was deleted');
          done();
        });
    });
  });
  it('should return an error 404 if orders not exist', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.delete('/orders/0')
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(404);
          expect(response.body.message).toEqual('Order not found.');
          done();
        });
    });
  });
  it('should return an error 401 if not token ', (done) => {
    request.delete(`/orders/${idOrders}`)
      .then((response) => {
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});
