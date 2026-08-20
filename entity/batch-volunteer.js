 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let batchVolunteer = new Schema({
    batchId: { type: Number },
    vId: { type: Number},
    createDate: { type: Number },
    updateDate: { type: Number }
});


batchVolunteer.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.BatchVolunteer = mongoose.model('BatchVolunteers', batchVolunteer);