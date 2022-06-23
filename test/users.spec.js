const request = require('supertest');
const assert = require('assert');
const express = require('express');
const supertest = require('supertest');
const app = require('../index');

const {
  getUsers,
} = require('../controller/users');

/* describe('getUsers', () => {
  it('should get users collection', async (done) => {
    // done();
    const response = await supertest(app)
      .post('/auth')
      .send({
        email: 'admiDefault@gmail.com',
        password: '123456',
      });
    expect(response.status).to.be.equal(200);

    done();

    expect(response.status).toBe(200);
  });
}); */

// .setHeader('access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlEZWZhdWx0QGdtYWlsLmNvbSIsInJvbGVzIjp0cnVlLCJpYXQiOjE2NTU5MTM0NjYsImV4cCI6MTY1NTkyMzU0Nn0.AhJVyFyMruKYwML67_Za7RFZVWeGFdOAjIbQ3E03CFA')

describe('GET /user', () => {
  it('responds with json', async (done) => {
    await supertest(app)
      .setHeader('access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlEZWZhdWx0QGdtYWlsLmNvbSIsInJvbGVzIjp0cnVlLCJpYXQiOjE2NTU5MTM0NjYsImV4cCI6MTY1NTkyMzU0Nn0.AhJVyFyMruKYwML67_Za7RFZVWeGFdOAjIbQ3E03CFA')
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});