/**
 * news Model for database schema
 *
 * @exports news
 */
 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let news = new Schema({
    companyName: { type: String },
    newsName: { type: String, lowercase: true },
    newsDetails: { type: String, index: true },
    active: { type: Boolean },
    attachment: { type: String },
    createDate: { type: Number },
    updateDate: { type: Number }
});


news.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.News = mongoose.model('News', news);