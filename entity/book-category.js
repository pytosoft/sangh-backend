/**
 * Book Model for database schema
 *
 * @exports book-category
 */
 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let bookCategory = new Schema({
    label: { type: String },
    value: { type: String},
    createDate: { type: Number },
    updateDate: { type: Number }
});


bookCategory.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.BookCategory = mongoose.model('Book-Category', bookCategory);