/**
 * news Model for database schema
 *
 * @exports Subscribers
 */
 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let subscribers = new Schema({
    subscriberId: { type: Number },
    name: { type: String },
    email: { type: String },
    fatherName: { type: String},
    address: { type: String},
    active: { type: Boolean },
    city: { type: String },
    mobile: { type: Number },
    pinCode: { type: Number },
    state: { type: String },
    subcriptions: { type: Array, "default": [] },
    createDate: { type: Number },
    createdBy: { type: String },
    updateDate: { type: Number },
    voucherNumber: {type: String},
    maker: {type: String}
});


subscribers.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.Subscriber = mongoose.model('Subscriber', subscribers);