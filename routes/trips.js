const express = require('express');
const router = express.Router();
const  { client } = require('../config/database');

client.connect().then((mongoDB)=> {
    const tripCollection = mongoDB.db('case').collection('trips') // it sets the path of trip collection 

    // it gets all trips which are started in a region specified by a point and time(optional) 
    router.post('/all', async (req, res) => {
        const { Point , radius, start_date, end_date } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})

        const query = {
            "start": {
                $geoWithin: {
                    $centerSphere: [ [ Point.long, Point.lat ], radius/6378.1 ]
                },
            }
        };
        if (start_date && new Date(start_date).toString() !== 'Invalid Date') query['start_date'] = new Date(start_date);
        if (end_date && new Date(end_date).toString() !== 'Invalid Date') query['complete_date'] = new Date(end_date);
        //const query = { start: {$geoWithin: { $center: [ [-97.38887025, 31.17821068], 5/6378.1 ] } } }
        const tripsList = [];
        const den = tripCollection.find(query).forEach(data => tripsList.push(data.distance_travelled)).finally((data) => { res.json({list: tripsList}) })
    })

    // it gets the minimum and maximum distance travelled for the trips 
    router.post('/getDistance', (req, res) => {
        const { Point , radius, start_date, end_date } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})

        const query = [
            { $sort: { year: 1 } },
            {
                $match: {
                    "start": {
                        $geoWithin: {
                            $centerSphere: [ [ Point.long, Point.lat ], radius/6378.1 ]
                        }
                    }
                }
            },
            {
                $group: { _id: null , maxDistance: { $max: "$distance_travelled" }, minDistance: { $min: "$distance_travelled" } }
            },
            { $project: { _id: 0 } }
        ]
        
        tripCollection.aggregate(query).toArray().then(data => res.json({ list: data }))
    })

    // it gets a report which should include the number of trips grouped by vehicle model year for the trips 
    router.post('/getReport', async (req, res) => {
        const { Point , radius, start_date, end_date } = req.body;
        if (!Point || !radius) res.json({message: 'Required parameters are missing, Point & radius'})

        const query = [
            { $sort: { year: 1 } },
            {
                $match: {
                    "start": {
                        $geoWithin: {
                            $centerSphere: [ [ Point.long, Point.lat ], radius/6378.1 ]
                        }
                    }
                }
            },
            {
                $group: { _id: "$year", numberOfTrips: { $sum: 1 } }
            }
        ]
        
        tripCollection.aggregate(query).toArray().then(data => res.json({ list: data }))
    })
}).catch(err => console.log('Connection Error'));

module.exports = router;
