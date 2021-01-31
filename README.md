CREATED by [AHMET UZGOR](https://www.linkedin.com/in/ahmet-uzgor-a1397a134/)

This folder includes node.js restful api which is written for a company case study .

In the below all route endpoints and its details are specified.

# Trips

| Route                  | HTTP Verb | POST body                                                                            | Description                                                                                                                         |
| ---------------------- | --------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| /api/trips/all         | `POST`    | required {token: 'auth_token', Point : {long: number, lat: number}, radius: number } | List all trips which are specified by a geoLocation Point and radius . Also start_date and end_date is optional                     |
| /api/trips/getDistance | `POST`    | {token: 'authToken', Point : {long: number, lat: number}, radius: number }           | List minimum and maximum distance travelled for trips which are specified by a geoLocation and radius                               |
| /api/trips/getReport   | `POST`    | {token: 'authToken', Point : {long: number, lat: number}, radius: number }           | List a report which should include the number of trips grouped by vehicle model year for trips which are specified by a geoLocation |

# Users

| Route         | HTTP Verb | POST body                            | Description             |
| ------------- | --------- | ------------------------------------ | ----------------------- |
| /             | `GET`     | Empty                                | It renders a login page |
| /register     | `POST`    | { username: 'foo', password:'1234' } | Create a new user.      |
| /authenticate | `POST`    | { username: 'foo', password:'1234' } | Generate a token.       |
