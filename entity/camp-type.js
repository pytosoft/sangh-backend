 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let campType = new Schema({
    id: { type: Number },
    description: { type: String},
    createDate: { type: Number },
    updateDate: { type: Number }
});


campType.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.CampType = mongoose.model('CampTypes', campType);