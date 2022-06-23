const supertest = require('supertest');
const app = require('../../server');

const request = supertest(app);

const adminEmailEmpty = {
  email: '',
  password: '123456',
};
const adminUserInvalid = {
  email: 'admin2@gmail.com',
  password: '123456',
};
const adminPasswordInvalid = {
  email: 'admin@gmail.com',
  password: '1234567',
};
const adminUserCorrect = {
  email: 'admin@gmail.com',
  password: '123456',
};

describe('POST AUTH', () => {
  it('should return a statusCode 200 when user exist', (done) => {
    request.post('/auth').send(adminUserCorrect).then((resp) => {
      expect(resp.statusCode).toEqual(200);
      done();
    });
  });
  it('should return an error 400 if email or password is empty', (done) => {
    request.post('/auth').send(adminEmailEmpty).then((resp) => {
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.message).toEqual('Email and password must not be empty.');
      done();
    });
  });
  it('should return an error 404 if user does not exist', (done) => {
    request.post('/auth').send(adminUserInvalid).then((resp) => {
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.message).toEqual('User does not exist.');
      done();
    });
  });
  it('should return an error 404 if password does not exist', (done) => {
    request.post('/auth').send(adminPasswordInvalid).then((resp) => {
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.message).toEqual('Credentials are invalid.');
      done();
    });
  });
});
