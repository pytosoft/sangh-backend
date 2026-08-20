let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let campPCate = new Schema({
    id: { type: Number },
    description: { type: String},
    createDate: { type: Number },
    updateDate: { type: Number }
});


campPCate.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.CampPCate = mongoose.model('CampPCate', campPCate);