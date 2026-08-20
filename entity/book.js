/**
 * Book Model for database schema
 *
 * @exports book
 */
 let mongoose = require('mongoose');
 Schema = mongoose.Schema;


let book = new Schema({
    bookName: { type: String },
    pricing: { type: Number},
    bookDetails: { type: String},
    category: { type: String },
    image: { type: String },
    createDate: { type: Number },
    updateDate: { type: Number }
});


book.pre('save', function (next) {
 this.updateDate = new Date().getTime();
 this.createDate = new Date().getTime();
 next();
});
exports.Book = mongoose.model('Books', book);