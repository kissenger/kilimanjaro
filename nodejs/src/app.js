
"use strict"

/**
 * Handles the public interface with the front-end.  Only routes are specified in this module
 * (with some others in app-auth.js) with suppporting functions abstracted to 'app-functions.js'
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const VizDB = require('./schema/data-model').DataRecord;
const dotenv = require('dotenv').config();

if (dotenv.error) {
  console.log(`ERROR from app.js: ${dotenv.error}`);
  process.exit(0);
}

const app = express();

// apply middleware - note setheaders must come first
// TODO:  (2) to inject /api on routes
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
// console.log(process.env.MONGODB_PASSWORD)
mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASSWORD}@cluster0-5h6di.gcp.mongodb.net/kilimanjaro?retryWrites=true&w=majority`,
  {useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection
  .on('error', console.error.bind(console, 'connection error:'))
  .on('close', () => console.log('MongoDB disconnected'))
  .once('open', () => console.log('MongoDB connected') );

app.get('/api/ping/', async (req, res) => {
  res.status(201).json({"hello": "world"});
})

/*****************************************************************
 * store new record to database
 ******************************************************************/
app.post('/api/create-new-record/', async (req, res) => {

  const data = req.body;

  try {
    const doc = await DataRecord.create(data);
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({myMessage: 'Error saving record - Unknown error'});
  }

});


app.post('/api/update-status/', async (req, res) => {

  const id = req.body.mongoId;
  const newStatus = req.body.newStatus;
  console.log(id)
  console.log(newStatus)

  const result = await PolygonDB.updateOne( { _id: id }, { $push: { 'properties.status': newStatus}});
  console.log(result);
  res.status(201).json(result);

})



app.get('/api/get-polygons-in-bbox', async (req, res) => {

  const box = { type: 'Polygon', coordinates: bbox2Polygon(req.query.bbox) };

  try {
    //resturn docs using sort to ensure same order providing bbox hasnt changed
    const docs = await PolygonDB.find( { geometry: { $geoIntersects: { $geometry: box} } }).sort({_id: 'asc'});
    res.status(200).json(docs2Geojsons(docs));
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// take the returned document array and return a geojson in the format required for the front-end
// 1) add a unique id *number* (so cannot use _id) at root level for mapbox featurestate
// 2) add the _id as mongoId under properties to ensure that id doesnt get stripped out when featurestate is returned
function docs2Geojsons(docsArr) {
  return docsArr.map( (d, i) => ({
    geometry: d._doc.geometry,
    properties: {
      ...d._doc.properties,
      mongoId: d._doc._id
    },
    id: i
  }))
}


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

// factors bbox to with shrink (factor < 1) or grow (factor > 1) box
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

// caps lat/lng to ensure no values out of range
function checkBoxBounds(bbox) {
  const minLng = bbox[0] < -180 ? -180 : bbox[0] > 180 ? 180 : bbox[0];
  const minLat = bbox[1] < -90  ? -90  : bbox[1] > 90  ? 90  : bbox[1];
  const maxLng = bbox[2] < -180 ? -180 : bbox[2] > 180 ? 180 : bbox[2];
  const maxLat = bbox[3] < -90  ? -90  : bbox[3] > 90  ? 90  : bbox[3];
  return [minLng, minLat, maxLng, maxLat];
}

// limit value (number) to n decimal places in precision
function limitPrecision(value, precision) {
  let multiplier = Math.pow(10, precision);
  return Math.round( value * multiplier ) / multiplier;
}

module.exports = app;

