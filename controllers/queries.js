module.exports = (Point, radius) => {
    return {
        all: {
            "start": {
                $geoWithin: {
                    $centerSphere: [ [ Point.long, Point.lat ], radius/6378.1 ] // it checks for points inside a center with given radian.so when divide to 6378.1  it converts parameter to km
                }
            }
        },
        getDistance: [
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
                $group: { _id: null , maxDistance: { $max: "$distance_travelled" }, minDistance: { $min: "$distance_travelled" } } // it find max distance and minimum distance in match query
            },
            { $project: { _id: 0 } } // it does not show _id
        ],
        getReport: [
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
                $group: { _id: "$year", numberOfTrips: { $sum: 1 } } // it counts number of trips are done inside of specified year
            }
        ]
    }
}