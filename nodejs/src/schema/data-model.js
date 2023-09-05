const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

  type: {type: String},
  geometry: {
    type: {type: String, required: true},
    coordinates: {type: [[[Number]]], required: true}
  },
  properties: {
    tags: [{type: String}],
    userId: {type: String},
    userName: {type: String},
    visibility: {type: String},
    timestamp: {type: Date},
    comments: {type: String}
  }
});

// dataSchema.index({ geometry: "2dsphere" });

const DataRecord = mongoose.model('DataRecord', dataSchema);

module.exports = {
  DataRecord
}
