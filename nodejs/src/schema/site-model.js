const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({

  type: {type: String, default: 'Feature'},
  geometry: {
    type: {type: String, required: true},
    coordinates: {type: [Number], required: true}
  },
  properties: {
    siteName: {type: String, required: true},
    siteDescription: {type: String, required: true},
    siteType: {type: String, required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    creationDate: {type: Date, default: Date.now},
    status: [{
      visibility: {type: Number},
      vizDate: {type: Date},
      creationDate: {type: Date, default: Date.now},
      userId: {type: String},
      userName: {type: String},
      comments: {type: String},
    }]
  }
});

// dataSchema.index({ geometry: "2dsphere" });

const SiteRecord = mongoose.model('SiteRecord',siteSchema);

module.exports = {
  SiteRecord
}
