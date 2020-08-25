var mongoose = require( 'mongoose' );


//subdocument
var usageSchema = new mongoose.Schema({
    Timestamp: {type: String, required: true},
    lpar_usage: {type: Array, required: true}
});

//USAGE schema
var usageActivitySchema = new mongoose.Schema({
    Report: {type: String, required: true},
    Usage: [usageSchema]
});

module.exports = mongoose.model('USAGEActivity', usageActivitySchema);