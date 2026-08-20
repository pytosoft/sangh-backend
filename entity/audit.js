/**
 * Audit log
 *
 * @exports Audit
 */
let mongoose = require('mongoose');
Schema = mongoose.Schema;

let audit = new Schema({
    type: { type: String },
    message: { type: String },
    actor: { type: String },
    data: { type: Object, default: {} },
    at: { type: Date },
    createDate: { type: Number },
    updateDate: { type: Number }
});

audit.pre('save', function (next) {
    const now = new Date().getTime();
    this.updateDate = now;
    this.createDate = this.createDate || now;
    this.at = this.at || new Date();
    next();
});

exports.Audit = mongoose.model('Audit', audit);
