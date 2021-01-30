const express = require('express');
const router = express.Router();
const  { client } = require('../config/database');

client.connect().then((mongoDB)=> {
    const tripCollection = mongoDB.db('case').collection('trips') // it sets the path of trip collection 

    // it makes a query all trips which are started in a region specified by a point 
    router.post('/all', async (req, res) => {
        const { Point , radius, start_date, end_date } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})
        console.log("MyBody",typeof req.body.Point,typeof Point.lat, typeof radius);
        const query = {
            "start": {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: [Point.long, Point.lat] },
                    $maxDistance: radius*1000,
                },
            }
        };
        if (start_date && new Date(start_date).toString() !== 'Invalid Date') query['start_date'] = new Date(start_date);
        if (end_date && new Date(end_date).toString() !== 'Invalid Date') query['complete_date'] = new Date(end_date);
        //const query = { start: {$geoWithin: { $center: [ [-97.38887025, 31.17821068], 5/6378.1 ] } } }
        const tripsList = [];
        const den = tripCollection.find(query).forEach(data => tripsList.push(data)).finally((data) => { res.json({list: tripsList}) })
        //den.then(data => console.log(data))
    })

    // it gets the minimum and maximum distance travelled for the trips 
    router.post('/getDistance', (req, res) => {
        const { Point , radius } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})
        console.log("MyBody",req.body);
        res.json({list: 'distances'})
    })

    // it gets a report which should include the number of trips grouped by vehicle model year for the trips
    router.post('/getReport', (req, res) => {
        const { Point , radius } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})
        console.log("MyBody",req.body);
        res.json({list: 'report'})
    })
}).catch(err => console.log('Connection Error'));

module.exports = router;
