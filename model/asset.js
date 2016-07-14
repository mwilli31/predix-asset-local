var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/PredixAssetDb');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "uri" : String,
    "model" : String
};
// create model if not exists.
module.exports = mongoose.model('asseturis',userSchema);
