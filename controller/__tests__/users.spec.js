const supertest = require('supertest');
const assert = require('assert');
const express = require('express');
const users = require('../../routes/users');
const app = require('../../index');

const request = supertest(app);

const adminUser = {
  email: 'admin@gmail.com',
  password: '123456',
};

describe('getUsers', () => {
  test('should get users collection', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      console.log(response.body);
      const token = response.body.accessToken;
      request.get('/users').set('access-token', `${token}`)
        .then((response) => {
          console.log(response.body);
          expect(response.statusCode).toEqual(200);
          done();
        });
    });
  });
});

 //   const res = await request(app).get('/users').set('access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGVzIjp0cnVlLCJpYXQiOjE2NTQ3MDIxODIsImV4cCI6MTY1NDcxMjI2Mn0.Lsf4GWIW6k2IrO1jPCZO11EWsvwIxjOV0eVVQZNaPx4').send();
  //   expect(res.status).toBe(400);
  //   console.log(res.status);
  //   const res2 = await request(app).get('/users').set('access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGVzIjp0cnVlLCJpYXQiOjE2NTQ3MDIxODIsImV4cCI6MTY1NDcxMjI2Mn0.Lsf4GWIW6k2IrO1jPCZO11EWsvwIxjOV0eVVQZNaPx4').send();
  //   expect(res2.status).toBe(200);
  //   console.log(res2.status);
  // });