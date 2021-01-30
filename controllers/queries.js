module.exports = (Point, radius) => {
    return {
        all: {
            "start": {
                $geoWithin: {
                    $centerSphere: [ [ Point.long, Point.lat ], radius/6378.1 ]
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
                $group: { _id: null , maxDistance: { $max: "$distance_travelled" }, minDistance: { $min: "$distance_travelled" } }
            },
            { $project: { _id: 0 } }
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
                $group: { _id: "$year", numberOfTrips: { $sum: 1 } }
            }
        ]
    }
}