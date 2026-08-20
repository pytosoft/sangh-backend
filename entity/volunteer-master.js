 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let volunteerMaster = new Schema({
    vId: { type: Number },
    vRNumber: { type: String},
    uId: { type: String},
    isVolunteer: { type: Boolean},
    campId:{type: Number},
    batchId: {type: Number},
    firstName: { type: String},
    lastName: { type: String},
    middleName: { type: String},
    dob: {type: Number},
    age: {type: Number},
    mobile: {type: Number},
    secondaryMobile: {type: Number},
    primaryEmail: {type: String},
    secondaryEmail: {type: String},
    oldCount: {type: Number},
    newCount: {type: Number},
    totalCount: {type: Number},
    vCount: {type: Number},
    address: { type: Array, "default": [] },
    createDate: { type: Number },
    updateDate: { type: Number }
});


volunteerMaster.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.VolunteerMaster = mongoose.model('VolunteerMasters', volunteerMaster);