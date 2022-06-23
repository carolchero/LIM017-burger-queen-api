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
  test('should get users collection', (done) => {
    request.post('/auth').send(adminUser).then((resp) => {
      const token = resp.body.accessToken;
      request.get('/users').set('access-token', `${token}`)
        .then((response) => {
          console.log(response, '--------------------------------------------------------------------------------------------');
          expect(response.statusCode).toEqual(200);
          done();
        });
    });
  });
});
