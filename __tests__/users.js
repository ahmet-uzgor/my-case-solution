const supertest = require('supertest');
const app = require('../app');
const client = require('../config/database');
const request = supertest(app)
let token ;

beforeAll(async (done)=> { // it sets mongodb connection and authentication token
  await client.connectToDB()
  request
    .post('/authenticate')
    .send('username=test&password=12345') // x-www-form-urlencoded upload
    .set('Accept', 'application/json')
    .end((err, res) => {
      if(err) return err;
      token = res.body.token;
      return done();
    });
})

beforeEach(() => {
  jest.useFakeTimers(); // to be able to fix async import time error , it creates fake timer beforeEach test
})


afterEach(() => {
  jest.runOnlyPendingTimers(); //it resets timer as normal to convert fakeTimer to normal 
  jest.useRealTimers()
})

describe('POST "/" root endpoint for login & authentication', function() {
  it('/register method with missing parameter returns error message', function(done) {
    request
      .post('/register')
      .send('username=john') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe("Username or password is not specified");
        return done();
      });
  });
  
  it('/register method with username&password creates an user', function(done) {
    request
      .post('/register')
      .send('username=john&password=12345') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('User created');
        return done();
      });
  });

  it('/authentication method with missing parameter (username || password) returns error message', function(done) {
    request
      .post('/authenticate')
      .send('username=john') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('Username or password is not specified');
        return done();
      });
  });

  it('/authentication method with wrong password returns wrong pass message', function(done) {
    request
      .post('/authenticate')
      .send('username=john&password=11111') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('Username or password is wrong');
        return done();
      });
  });

  it('/authentication method with wrong username returns user not found message', function(done) {
    request
      .post('/authenticate')
      .send('username=johny&password=12345') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('Username or password is wrong');
        return done();
      });
  });

  it('/authenticate method with true username&password returns an authentication token', function(done) {
    request
      .post('/authenticate')
      .send('username=john&password=12345') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.status).toBe(true);
        expect(typeof res.body.token).toBe('string')
        return done();
      });
  });
});


describe('tests "/api/trips" for getReport, all & getDistance endpoints', function() {

  it('/api/trips/all endpoint with token and true parameters returns all trips list which are specified by a Point', function(done) {
    const body = {token: token, Point: {long: -97.32, lat: 31.18}, radius: 5 }
    request
      .post('/api/trips/all')
      .send(body) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(typeof res.body.list).toBe('object');
        expect(res.body.list.length >= 1).toBe(true);
        expect(res.body.list[0].model).not.toBeNull();
        return done();
      });
  });

  it('/api/trips/all endpoint with token and start_date or end_date param returns all trips list which are specified by a Point and a date', function(done) {
    const body = {token: token, Point: { "long": -97.3888702, "lat": 31.17821068 }, radius: 5, start_date: "07/27/2016 02:37" }
    request
      .post('/api/trips/all')
      .send(body) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(typeof res.body.list).toBe('object');
        expect(res.body.list.length >= 1).toBe(true);
        expect(res.body.list[0].model).not.toBeNull();
        return done();
      });
  });

  it('/api/trips/getDistance methods with token and true parameters returns all trips list which are specified by a Point', function(done) {
    const body = {token: token, Point: {long: -97.32, lat: 31.18}, radius: 5 }
    request
      .post('/api/trips/getDistance')
      .send(body) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(typeof res.body.list).toBe('object');
        expect(res.body.list[0].maxDistance).not.toBeNull();
        return done();
      });
  }); 

  it('/api/trips/getReport endpoint with token and true parameters returns report with number of trips that done in model year', function(done) {
    const body = {token: token, Point: {long: -97.32, lat: 31.18}, radius: 5 }
    request
      .post('/api/trips/getReport')
      .send(body) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(typeof res.body.list).toBe('object');
        expect(res.body.list[0].numberOfTrips).not.toBeNull();
        return done();
      });
  });

  it('/api/trips/ methods without auth token returns error message', function(done) {
    request
      .post('/api/trips/all')
      .type('form')
      .send({ Point: {long: -97.32, lat: 31.18}, radius: 5 }) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('Token is not provided');
        return done();
      });
  });

  it('/api/trips/ methods with wrong auth token returns error message', function(done) {
    request
      .post('/api/trips/all')
      .type('form')
      .send({ token: "wrongtoken12345", Point: {long: -97.32, lat: 31.18}, radius: 5 }) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('Wrong token is provided');
        return done();
      });
  });

  it('/api/trips/ endpoint with token but missing parameters returns error message', function(done) {
    const body = {token: token, Point: {long: -97.32, lat: 31.18} } // radius is missing parameter.
    request
      .post('/api/trips/all')
      .send(body) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('Required parameters are missing, Point & radius');
        return done();
      });
  });

  it('/api/trips/ endpoint with token but if parameters are not in intended format returns error message', function(done) {
    const body = {token: token, Point: {long: '-97.32', lat: 31.18}, radius:5 } // Point.long parameter is string but it should be number.
    request
      .post('/api/trips/all')
      .send(body) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.message).toBe('Parameters are not in intended formats, all should be number');
        return done();
      });
  });

});
