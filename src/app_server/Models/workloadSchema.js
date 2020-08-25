var mongoose = require( 'mongoose' );

//subdocument
var workloadSchema = new mongoose.Schema({
    Timestamp: {type: String, required: true},
    Caption: {type: Array, required: true},
    Class: {type: Array, required: true}
});

//CPC schema
var workloadActivitySchema = new mongoose.Schema({
    Report: {type: String, required: true},
    Workload: [workloadSchema]
});



module.exports = mongoose.model('WorkloadActivity', workloadActivitySchema);