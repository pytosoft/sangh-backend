/**
 * Book Model for database schema
 *
 * @exports States */
 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let States = new Schema({
    state: { type: String },
    district: { type: String},
    stateType: {type: String},
    createDate: { type: Number },
    updateDate: { type: Number }
});


States.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.States= mongoose.model('states', States);