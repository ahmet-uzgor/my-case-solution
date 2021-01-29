const { config } = require('dotenv/types');
const express = require('express');
const router = express.Router();
const  { client } = require('../config/database');
const tripDB = client.db('case').collection('trips');

router.post('/all', async (req, res) => {
    // const { Point , radius, start_date, end_date } = req.body;
    console.log(MyBody,req.body);
    const query = {
        "start": {
            $nearSphere: {
                $geometry: { type: "Point", coordinates: [-97.38887025, 31.17821068] },
                $maxDistance: 5000,
            },
        },
    };
    //const query = { start: {$geoWithin: { $center: [ [-97.38887025, 31.17821068], 5/6378.1 ] } } }
    const den = tripDB.find(query)
    let i = 1
    const tripList = await den.forEach((data) => {
        console.log(i,data.start)
        i++
    });
    res.json({trips: tripList})

})

module.exports = router;