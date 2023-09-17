
"use strict"

/**
 * Handles the public interface with the front-end.  Only routes are specified in this module
 * (with some others in app-auth.js) with suppporting functions abstracted to 'app-functions.js'
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Sites = require('./schema/site-model').SiteRecord;
const dotenv = require('dotenv').config();


if (dotenv.error) {
  console.log(`ERROR from app.js: ${dotenv.error}`);
  process.exit(0);
}

const app = express();

// apply middleware - note setheaders must come first
app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Request-With, Content-Type, Accept, Authorization, Content-Disposition");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
  next();
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.originalUrl}`);
  next();
})


// mongo as a service
mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASSWORD}@cluster0-5h6di.gcp.mongodb.net/kilimanjaro?retryWrites=true&w=majority`,
  {useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection
  .on('error', console.error.bind(console, 'connection error:'))
  .on('close', () => console.log('MongoDB disconnected'))
  .once('open', () => console.log('MongoDB connected') );

app.get('/ping', async (req, res) => {
  res.status(201).json({"hello": "world"});
})

app.post('/api/save-record', async (req, res) => {
  const data = req.body;
  console.log(data);

  try {
    const doc = await Sites.create(data);
    res.status(200).json({status: 200});
  } catch(error) {
    res.status(500).json({status: 600, error});
  }

});


app.get('/api/get-sites/:offset/:limit/:sort/:direction/:searchText',  async (req, res) => {

  const box = { type: 'Polygon', coordinates: bbox2Polygon(req.query.bbox) };
  let query = { geometry: { $geoIntersects: { $geometry: box} } };
  if (req.params.searchText !== ' ') {
    const searchString = '\"' + req.params.searchText.split(' ').join('\" \"') + '\"'
    query= {$and: [query, { $text: {$search: searchString, $caseSensitive: false} }]};
  }

  const docs = await Sites.aggregate([
    { $match: query },
    { $addFields: {
      lastStatus: {
        $arrayElemAt: ["$properties.status", -1]
        }
      },
    },
    { $project:
      {
        "lowerCaseName": {
          $toLower: "$properties.siteName"
        },
        // creationDate: 1,
        // name: "$properties.siteName",
        properties: 1,

        geometry: 1
        // siteId: "$_id"
      },
    },
    sort(req.params.sort, req.params.direction),
    { $facet: {
        count: [{ $count: "count" }],
        list: [
          { $skip: req.params.limit * req.params.offset },
          { $limit: req.params.limit * 1 }
        ] } }
  ]);

  let count;
  try {
    count = docs[0].count[0].count;
  } catch {
    count = 0;
  }

  res.status(201).json( {list: docs[0].list, count} );

  function sort(sortType, sortDirection) {
    switch(sortType) {
      case 'a-z':
        return { $sort: { "lowerCaseName": sortDirection * 1 } };
      case 'viz':
        return { $sort: { "lastStatus.visibility": sortDirection * 1 } };
      case 'date':
        return { $sort: { "lastStatus.creationDate": sortDirection * 1 } };
      default:
        return new Error('Invalid sort condition');
  }
}
})

app.post('/api/update-status/', async (req, res) => {

  const id = req.body.mongoId;
  const newStatus = req.body.newStatus;
  console.log(id)
  console.log(newStatus)

  const result = await Sites.updateOne( { _id: id }, { $push: { 'properties.status': newStatus}});
  console.log(result);
  res.status(201).json(result);

})



function bbox2Polygon(bbox) {

  // define a factor
  const factor = 0.95;

  bbox = scaleBox(bbox.map( a => a * 1), factor);
  bbox = checkBoxBounds(bbox)
  bbox = bbox.map(a => limitPrecision(a, 7));

  // return polygon
  return [[
    [ bbox[0], bbox[1] ],
    [ bbox[2], bbox[1] ],
    [ bbox[2], bbox[3] ],
    [ bbox[0], bbox[3] ],
    [ bbox[0], bbox[1] ]
  ]]
}

function scaleBox(bbox, factor) {

  const minLat = bbox[1];
  const maxLat = bbox[3];
  const minLng = bbox[0];
  const maxLng = bbox[2];

  const lngRange = maxLng - minLng;
  const latRange = maxLat - minLat;

  const lngShift = (lngRange - lngRange * factor) / 2;
  const latShift = (latRange - latRange * factor) / 2;

  return [
    minLng < 0 ? minLng - lngShift : minLng + latShift,
    minLat < 0 ? minLat - latShift : minLat + latShift,
    maxLng < 0 ? maxLng + lngShift : maxLng - latShift,
    maxLat < 0 ? maxLat + latShift : maxLat - latShift
  ]

}

function checkBoxBounds(bbox) {
  const minLng = bbox[0] < -180 ? -180 : bbox[0] > 180 ? 180 : bbox[0];
  const minLat = bbox[1] < -90  ? -90  : bbox[1] > 90  ? 90  : bbox[1];
  const maxLng = bbox[2] < -180 ? -180 : bbox[2] > 180 ? 180 : bbox[2];
  const maxLat = bbox[3] < -90  ? -90  : bbox[3] > 90  ? 90  : bbox[3];
  return [minLng, minLat, maxLng, maxLat];
}

function limitPrecision(value, precision) {
  let multiplier = Math.pow(10, precision);
  return Math.round( value * multiplier ) / multiplier;
}


module.exports = app;

