const supertest = require('supertest');
const app = require('../app');
const request = supertest(app)
let token = "deneme";

token = request
    .post('/authenticate')
    .send('username=test&password=test') // x-www-form-urlencoded upload
    .set('Accept', 'application/json')
    .end((err, res) => {
        if(err) return err;
        console.log(res.body);
        return res.body.token;
    })