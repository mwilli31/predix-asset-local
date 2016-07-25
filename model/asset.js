var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/PredixAssetDb');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "uri" : String,
    "edge-alias" : String,
    "kits" : String,
    "manufacturers" : String,
    "oems" : String,
    "sensors" : String,
    "category" : String,
    "protocols" : String,
    "model" : String,
    "devices" : String
};
// create model if not exists.
module.exports = mongoose.model('asseturis',userSchema);
