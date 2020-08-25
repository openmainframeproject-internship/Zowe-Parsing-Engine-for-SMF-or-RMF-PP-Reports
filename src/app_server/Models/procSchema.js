var mongoose = require( 'mongoose' );

//subdocument
var procSchema = new mongoose.Schema({
    Timestamp: {type: String, required: true},
    lpar_proc: {type: Array, required: true}
});

//Proc schema
var procActivitySchema = new mongoose.Schema({
    Report: {type: String, required: true},
    Proc: [procSchema]
});



module.exports = mongoose.model('PROCActivity', procActivitySchema);