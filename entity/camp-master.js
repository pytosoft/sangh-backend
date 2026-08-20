 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let campMaster = new Schema({
    id: { type: Number },
    campType: { type: String},
    campParticipantsType: { type: String},
    city: { type: String},
    dist: { type: String},
    state: { type: String},
    siteLocation: { type: String}, 
    year: {type: Number},
    fromDate: {type: Number},
    toDate: {type: Number},
    noOfDays: {type: Number},
    oldCount: {type: Number},
    newCount: {type: Number},
    totalCount: {type: Number},
    vCount: {type: Number},
    memberIds: {type: Array},
    vIds: {type: Array},
    createDate: { type: Number },
    updateDate: { type: Number }
});


campMaster.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.CampMaster = mongoose.model('CampMasters', campMaster);