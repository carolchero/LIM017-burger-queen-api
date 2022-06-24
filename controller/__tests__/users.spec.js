const supertest = require('supertest');
const assert = require('assert');
const express = require('express');
const users = require('../../routes/users');
const app = require('../../server');

const request = supertest(app);

const adminUser = {
  email: 'admin@gmail.com',
  password: '123456',
};

const userNoAdmi = {
  email: 'user5@gmail.com',
  password: '123456',
  roles: false,
};

describe('GET USERS', () => {
  it('should get users collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/users').set('access-token', `${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 401 when is not token', (done) => {
    request.post('/auth').send({}).then((resp) => {
      const token = resp.body;
      request.get('/users').set('access-token', `${token}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .then((response) => {
          expect(response.body.message).toEqual('Unauthorized');
          done();
        });
    });
  });
});

// en proceso
/* describe('DELETE USER', () => {
  it('should delete user by id', (done) => {
    request.post('/users/8')
      .send(userNoAdmi)
      .expect('Content-Type', /json/)
      .expect(200);
      .then((response) => {
        console.log(response.body)
        expect(response.statusCode).toEqual(200);
      });
    done();
  });
});

describe('POST USERS', () => {
  it('should', (done) => {
    request.post('/users')
      .send(userNoAdmi)
      .expect('Content-Type', /json/)
      .then((response) => {
        console.log(response.body)
        expect(response.statusCode).toEqual(200);
      });
    done();
  });
});

 */
