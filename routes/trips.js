const express = require('express');
const router = express.Router();
const  { client } = require('../config/database');
const queries = require('../controllers/queries');

client.connect().then((mongoDB)=> { // it starts mongoDb connection to find necessary documents for clients
    const tripCollection = mongoDB.db('case').collection('trips') // it sets the path of trip collection 

    // it gets all trips which are started in a region specified by a point and time(optional) 
    router.post('/all', async (req, res) => {
        const { Point , radius, start_date, end_date } = req.body; // start_date and end_date should be (MM/DD/YY %H:%M)
        if (!Point || !Point.long || !Point.lat || !radius) return res.json({message: 'Required parameters are missing, Point & radius'}) // if Point or radius is not given, it returns message
        if (typeof Point.long !== 'number' || typeof Point.lat !== 'number' || typeof radius !== 'number') return res.json({ message : 'Parameters are not in intended formats, all should be number'})

        const query = queries(Point, radius).all; // it keeps query for listing all trips specified by a point 
        if (start_date && new Date(start_date).toString() !== 'Invalid Date') {
            const a = new Date(start_date); // it converts string to intended UTC time but it subtracts 3 hours
            const utcTime = new Date(a.setHours(a.getHours() +3)); // it adds 3 hours to (a) intended time 
            a.setMinutes(a.getMinutes() +1) // in db times are in dd-mm-yy %H:%M:%S but in paramaters no second so to find trips regarding time it controls between given time and given time +1 minute
            query.$and = [{ start_date: { $gte: utcTime } }, {start_date: {$lt: a }}] // if start_date or end_date is specified, it adds to query for date
        }
        if (end_date && new Date(end_date).toString() !== 'Invalid Date') {
            const b = new Date(end_date);
            const utcTime = new Date(b.setHours(b.getHours() + 3));
            b.setMinutes(b.getMinutes() +1)
            query['$and'] = [{ complete_date: { $gte: utcTime } }, {complete_date: {$lt: b }}]
        }

        // it made a query for matched collection and saved to tripsList and respond as json object with data 
        tripCollection.find(query).toArray().then(data => res.json({ list: data }))
        //res.json({deneme: "deneme"});
    })

    // it gets the minimum and maximum distance travelled for the trips which are specified by a Point
    router.post('/getDistance', (req, res) => {
        const { Point , radius } = req.body;
        if (!Point || !Point.long || !Point.lat || !radius) return res.json({message: 'Required parameters are missing, Point & radius'})
        if (typeof Point.long !== 'number' || typeof Point.lat !== 'number' || typeof radius !== 'number') return res.json({ message : 'Parameters are not in intended formats, all should be number'})

        const query = queries(Point, radius).getDistance;
        
        // it makes a query and assign returned data to array and respond this array to client
        tripCollection.aggregate(query).toArray().then(data => res.json({ list: data })).catch(err => res.json({ err: err, message: 'Query error'}))
    })

    // it gets a report which should include the number of trips grouped by vehicle model year for the trips 
    router.post('/getReport', (req, res) => {
        const { Point , radius } = req.body;
        if (!Point || !Point.long || !Point.lat || !radius) return res.json({message: 'Required parameters are missing, Point & radius'})
        if (typeof Point.long !== 'number' || typeof Point.lat !== 'number' || typeof radius !== 'number') return res.json({ message : 'Parameters are not in intended formats, all should be number'})

        const query = queries(Point, radius).getReport;
        
        tripCollection.aggregate(query).toArray().then(data => res.json({ list: data })).catch(err => res.json({ err: err, message: 'Query error'}))
    })
}).catch(err => console.log('Connection Error', err));

module.exports = router;
