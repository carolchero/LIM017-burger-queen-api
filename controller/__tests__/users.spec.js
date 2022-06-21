/* eslint-disable quotes */
/* eslint-disable import/no-unresolved */
const request = require('supertest');
const assert = require('assert');
const express = require('express');
//const app = require('../../routes/users');
const app = express();

const {
  getUsers,
} = require('../users');
//const { hasUncaughtExceptionCaptureCallback } = require('process');

describe("GET/tasks", () => {
  console.log(app);
  test('should respond with a 500 status code',async()=>{
    const response = await request(app)
      .get("/tasks")
      .send();
    expect(response.statusCode).toBe(404);
    console.log(response);
  });
  it ('should get users collection',(done)=>{
    done();
  });
});


describe('POST /user', function() {
  it('user.name should be an case-insensitive match for "john"', function(done) {
    request(app)
      .post('/user')
      .send('name=john') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body.id = 'some fixed id';
        res.body.name = res.body.name.toLowerCase();
      })
      .expect(200, {
        id: 'some fixed id',
        name: 'john'
      }, done);
  });
});