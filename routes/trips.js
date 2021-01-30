const express = require('express');
const router = express.Router();
const  { client } = require('../config/database');
const queries = require('../controllers/queries');

client.connect().then((mongoDB)=> { // it starts mongoDb connection to find necessary documents for clients
    const tripCollection = mongoDB.db('case').collection('trips') // it sets the path of trip collection 

    // it gets all trips which are started in a region specified by a point and time(optional) 
    router.post('/all', async (req, res) => {
        const { Point , radius, start_date, end_date } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'}) // if Point or radius is not given, it returns message

        const query = queries(Point, radius).all; // it keeps query for listing all trips by specified a point 
        if (start_date && new Date(start_date).toString() !== 'Invalid Date') query['start_date'] = new Date(start_date); // if start_date or end_date is specified, it adds to query for date
        if (end_date && new Date(end_date).toString() !== 'Invalid Date') query['complete_date'] = new Date(end_date);

        const tripsList = []; // it initializes tripList as array to keep query result as array
        // it made a query for matched collection and saved to tripsList and respond as json object with data 
        tripCollection.find(query).toArray().then(data => res.json({ list: data }))
        //tripCollection.find(query).forEach(data => tripsList.push(data.distance_travelled)).finally((data) => { res.json({list: tripsList}) })
    })

    // it gets the minimum and maximum distance travelled for the trips which are specified by a Point
    router.post('/getDistance', (req, res) => {
        const { Point , radius } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})

        const query = queries(Point, radius).getDistance;
        
        // it makes a query and assign returned data to array and respond tihs array to client
        tripCollection.aggregate(query).toArray().then(data => res.json({ list: data })).catch(err => res.json({ err: err, message: 'Query error'}))
    })

    // it gets a report which should include the number of trips grouped by vehicle model year for the trips 
    router.post('/getReport', (req, res) => {
        const { Point , radius } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})

        const query = queries(Point, radius).getReport;
        
        tripCollection.aggregate(query).toArray().then(data => res.json({ list: data })).catch(err => res.json({ err: err, message: 'Query error'}))
    })
}).catch(err => console.log('Connection Error'));

module.exports = router;
