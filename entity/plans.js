/**
 * news Model for database schema
 *
 * @exports Plans
 */
 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let plans = new Schema({
    planId: { type: Number },
    bookId: { type: String },
    name: { type: String },
    createdBy: { type: String },
    price: { type: Number},
    active: { type: Boolean },
    duration: { type: Number },
    description: { type: String },
    books: { type: Array, "default": [] },
    createDate: { type: Number },
    updateDate: { type: Number }
});


plans.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.Plans = mongoose.model('Plans', plans);