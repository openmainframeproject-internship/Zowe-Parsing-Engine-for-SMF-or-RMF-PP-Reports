var mongoose = require( 'mongoose' );

//subdocument
var cpcSchema = new mongoose.Schema({
    Timestamp: {type: String, required: true},
    caption: {type: Array, required: true},
    lpar: {type: Array, required: true}
});

//CPC schema
var cpcActivitySchema = new mongoose.Schema({
    Report: {type: String, required: true},
    CPU: [cpcSchema]
});



module.exports = mongoose.model('CPCActivity', cpcActivitySchema);