CREATED by [AHMET UZGOR](https://www.linkedin.com/in/ahmet-uzgor-a1397a134/)

This folder includes node.js restful api which is written for a company case study .
Used technologies are listed below:

Node.js => express, mongodb (native) for database, jwt - jsonwebtoken for authentication, bcrypt.js for hashing, jest + supertest for testing

To be able to start app please follow below codes; and please change MONGODB_URI with yours under .env
```
git clone https://github.com/ahmet-uzgor/my-case-solution.git
cd my-case-colution
npm install
npm start
```
It will start on localhost:3000 or 127.0.0.1:3000.

ALSO you can test this app from this [site](https://obscure-fortress-36622.herokuapp.com/)

Also to run test under __test__ folder. Run below code. 
```
npm run test
```

NOTE! = To pass all test your PC time settings should be __UTC+3__ or need to change these two lines in routes/trips
```
line:18   const utcTime = new Date(a);
line:24   const utcTime = new Date(b);
```

There are 14 test for all endpoints. Test details and results are below.

![alt text](https://i.ibb.co/JHgYd5D/test-Result.png)

All endpoints are collected under routes. Users include / , /register and /authentication endpoints Trips include api/trips/all, api/trips/getDistance & api/trips/getReport endpoints. All routes under "/api" needs authentication. Witjout authentication_token or wrong token it responds error message.

To be able to take an authentication token which is valid for 30 minutes.Firstly you need to register , You can send a post request with username & password or
after run the app you can register via login page at localhost:3000 or heroku [website](https://obscure-fortress-36622.herokuapp.com/)

Or without register you can use test user => username=test , password=12345
After registeration you need to send post request with username & password ant it returns a token. With this token you can reach other endpoints under api/

In the below all route endpoints and its details are specified.

# Trips

| Route                  | HTTP Verb | POST body                                                                                                                                                      | Description                                                                                                                         |
| ---------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| /api/trips/all         | `POST`    | required {token: 'auth_token', Point : {long: number, lat: number}, radius: number } optional { start_date: 'MM/DD/YYYY %H:%M', end_date: 'MM/DD/YYYY %H:%M' } | List all trips which are specified by a geoLocation Point and radius . Also start_date and end_date is optional                     |
| /api/trips/getDistance | `POST`    | {token: 'authToken', Point : {long: number, lat: number}, radius: number }                                                                                     | List minimum and maximum distance travelled for trips which are specified by a geoLocation and radius                               |
| /api/trips/getReport   | `POST`    | {token: 'authToken', Point : {long: number, lat: number}, radius: number }                                                                                     | List a report which should include the number of trips grouped by vehicle model year for trips which are specified by a geoLocation |

# Users

| Route         | HTTP Verb | POST body                            | Description             |
| ------------- | --------- | ------------------------------------ | ----------------------- |
| /             | `GET`     | Empty                                | It renders a login page |
| /register     | `POST`    | { username: 'foo', password:'1234' } | Create a new user.      |
| /authenticate | `POST`    | { username: 'foo', password:'1234' } | Generate a token.       |
