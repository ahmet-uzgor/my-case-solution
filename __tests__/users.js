const supertest = require('supertest');
const app = require('../app');
const request = supertest(app)
let token = "";

describe('POST "/" root endpoint for login & authentication', function() {
  it('/register method with missing parameter returns', function(done) {
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


// describe('tests "/" root endpoint for login and authentication', function() {
//   it('register endpoint', async function(done) {
//     const res = await request.post('/register')
//     .send({ username: 'ahmet10', password: 12345 }).expect(200);
//     expect(res.body.message).toBe('User created');
//     done()
//   });
// });