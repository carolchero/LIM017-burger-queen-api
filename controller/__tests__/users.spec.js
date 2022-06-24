const supertest = require('supertest');
const app = require('../../server');

const request = supertest(app);

const adminUser = {
  email: 'admin@gmail.com',
  password: '123456',
};

const userCreate = {
  email: 'user5@gmail.com',
  password: '123456',
  roles: false,
};

const user = {
  email: 'user5@gmail.com',
  password: '123456',
};

const userNull = {
  email: '',
  password: '',
};

const userError = {
  email: 'error',
  password: '123456',
};

let idUser = '';

describe('POST USERS', () => {
  it('should post create users', (done) => {
    request.post('/users')
      .send(userCreate)
      .then((response) => {
        idUser = response.body.id;
        expect(response.statusCode).toEqual(200);
        expect(response.body.id).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        done();
      });
  });

  it('should return an error 400 if Email and password must not be empty', (done) => {
    request.post('/users')
      .send(userNull)
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toBe('Email and password must not be empty.');
        done();
      });
  });

  it('should return an error 403 if exist user', (done) => {
    request.post('/users')
      .send(userCreate)
      .then((response) => {
        expect(response.statusCode).toEqual(403);
        expect(response.body.error).toBeTruthy();
        done();
      });
  });
});

describe('GET USERS', () => {
  it('should get users collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/users').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.post('/auth').send(user).then((resp) => {
      const token = resp.body;
      request.get('/users').set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body.message).toEqual('Unauthorized');
          done();
        });
    });
  });
});

describe('GET USERS ID', () => {
  it('should get users collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get(`/users/${idUser}`).set('access-token', `${token}`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.id).toBeTruthy();
          expect(response.body.email).toBeTruthy();
          done();
        });
    });
  });

  it('should return an error 404 if not existe user', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/users/0').set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(404);
          expect(response.body.error).toBe('User not found.');
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.post('/auth').send(user).then((resp) => {
      const token = resp.body;
      request.get('/users/1').set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(401);
          expect(response.body.message).toEqual('Unauthorized');
          done();
        });
    });
  });
});

describe('PUT USER', () => {
  it('should edit user by id', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.put(`/users/${idUser}`)
        .set('access-token', `${token}`)
        .send(userCreate)
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.id).toBeTruthy();
          expect(response.body.email).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 404 if user not exist', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.put('/users/0')
        .set('access-token', `${token}`)
        .send(userCreate)
        .then((response) => {
          expect(response.statusCode).toEqual(404);
          expect(response.body.error).toEqual('User not found.');
          done();
        });
    });
  });
  it('should return an error 400 if Email and password must not be empty', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.put(`/users/${idUser}`)
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(400);
          expect(response.body.message).toEqual('Email and password must not be empty.');
          done();
        });
    });
  });
  it('should return an error 500 if exist error', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.put(`/users/${idUser}`)
        .set('access-token', `${token}`)
        .send(userError)
        .then((response) => {
          expect(response.statusCode).toEqual(500);
          expect(response.body.error).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 if not token ', (done) => {
    request.put(`/users/${idUser}`)
      .then((response) => {
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});

describe('DELETE USER', () => {
  it('should delete user by id', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.delete(`/users/${idUser}`)
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.message).toEqual('User was deleted');
          done();
        });
    });
  });
  it('should return an error 404 if user not exist', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.delete(`/users/${idUser}`)
        .set('access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toEqual(404);
          expect(response.body.error).toEqual('User not found.');
          done();
        });
    });
  });
  it('should return an error 401 if not token ', (done) => {
    request.delete(`/users/${idUser}`)
      .then((response) => {
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
  });
});
