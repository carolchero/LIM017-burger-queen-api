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

describe('getUsers', () => {
  it('should get users collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/users').set('access-token', `${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          console.log(response.body);
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
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
