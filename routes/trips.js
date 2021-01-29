const express = require('express');
const router = express.Router();
const  { client } = require('../config/database');

client.connect().then((mongoDB)=> {
    const tripCollection = mongoDB.db('case').collection('trips') // it sets the path of trip collection 

    // it makes a query all trips which are started in a region specified by a point 
    router.post('/all', async (req, res) => {
        const { Point , radius, start_date, end_date } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})
        console.log("MyBody",req.body);
        const query = {
            "start": {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: [Point.long, Point.lat] },
                    $maxDistance: radius,
                },
            },
        };
        //const query = { start: {$geoWithin: { $center: [ [-97.38887025, 31.17821068], 5/6378.1 ] } } }
        const den = tripCollection.find(query)
        //den.then(data => console.log(data))

        res.json({list: 'tripList'})
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
});

module.exports = router;
