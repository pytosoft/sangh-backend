/**
 * news Model for database schema
 *
 * @exports Subscription
 */
 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let subscription = new Schema({
    subscriberId: { type: String},
    planId: {type: Number},
    bookId: {type: String},
    createdBy: { type: String },
    duration: {type: Number},
    price: {type: Number},
    startDate: { type: Number},
    active: { type: Boolean },
    endDate: { type: Number },
    name: { type: String},
    city: { type: String},
    state: { type: String},
    deliveryAddress: { type: Object, "default": {
        
    } },
    createDate: { type: Number },
    updateDate: { type: String },
    displayId: {type: String}
});


subscription.pre('save', function (next) {
 this.createDate = new Date().getTime();
 next();
});
exports.Subscription = mongoose.model('Subscription', subscription);