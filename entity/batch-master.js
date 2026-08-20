 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let batchMaster = new Schema({
    batchId: { type: Number },
    campId: { type: Number},
    count: {type: Number},
    createDate: { type: Number },
    updateDate: { type: Number }
});


batchMaster.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.BatchMaster = mongoose.model('BatchMasters', batchMaster);