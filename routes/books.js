const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let Book = require('../entity/book').Book;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({dest: 'uploads/'});
let fs = require('fs');
let BookCategory = require('../entity/book-category').BookCategory;
const isAuth = require('../middleware/is-auth')

/**
 * books
 * @purpose: This Rest API  used to  get all book
 * @method: GET
 */
router.get("/list", isAuth,(req, res, next) => {
    let response;
    let sortBy = req.query.sortBy;
    let limit = req.query.limit || 50;
    let pageNo = req.query.pageNo || 1;
    let pipe = [];
    pipe.push({$limit: limit});
    pipe.push({$skip: ((pageNo - 1) * limit)});
    if (AppUtil.isNumber(sortBy)) {
        let sortQ = {};
        switch (sortBy) {
            case 0://rating
                sortQ = {avgRating: -1};
                break;
            case 1://popular
                sortQ = {avgRating: -1};
                break;
            case 2://latest
                sortQ = {createDate: -1};
                break;
            case 3://free
                sortQ = {avgRating: -1};
                break;
        }
        pipe.push({"$sort": sortQ});
    }
    Book.aggregate(
        pipe, function (err, booksList) {
            if (err) {
                console.log('error ', err);
                res.sendStatus(500);
            } else if (booksList) {
                response = Response.createResponse(Response.RequestStatus.Success, "books list", booksList);
                res.status(200).json(response);
            } else {
                response = Response.createResponse(Response.RequestStatus.Success, "No books found.", []);
                res.status(200).json(response);
            }
        });
})
/**
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/", isAuth,upload.single('attachment'), (req, res, next) => {
    let bookName = req.body.bookName;
    let attachment = req.file;
    if (bookName) {
          Book.countDocuments({ bookName: bookName }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Book already available with this name.');
                res.json(200, response);
            } else {
                if(attachment){
                    if (!fs.existsSync('uploads')) {
                        fs.mkdirSync('uploads');
                    }
                    if (!fs.existsSync('uploads/books')) {
                        fs.mkdirSync('uploads/books');
                    }
                    let originalPath = 'uploads/books'+ '/' + new Date().getTime() + AppUtil.getFileNameByFileObject(attachment);
                    fs.rename(attachment.path, originalPath, function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            req.body.image = originalPath;
                            let book = new Book(req.body);
                            book.save((err, result) => {
                                if (err) {
                                    res.sendStatus(500);
                                } else {
                                    let response = Response.createResponse(Response.RequestStatus.Success, "book saved.", result);
                                    res.status(200).json(response);
                                }
                            });
                        }
                    });
                } else{
                    let book = new Book(req.body);
                    book.save(function (err, results) {
                        if (err) {
                        let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else {
                            let message = "Book Saved.";
                            let response = Response.createResponse(Response.RequestStatus.Success, message);
                            res.status(200).json(response);
                        }
                    });
                }
            }
        });
        
      
    } else {
        res.sendStatus(400);
    }
})
/**
 * Book
 * @purpose: This Rest API  used to  remove Book
 * @method: POST
 */
 router.get("/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        Book.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "Book Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * Book
 * @purpose: This Rest API  used to update Book
 * @method: Update
 */
 router.post("/update", isAuth,upload.single('attachment'), (req, res, next) => {
    let bookName = req.body.bookName;
    let attachment = req.file;
    if (bookName && req.body._id) {
                if(attachment){
                    if (!fs.existsSync('uploads')) {
                        fs.mkdirSync('uploads');
                    }
                    if (!fs.existsSync('uploads/books')) {
                        fs.mkdirSync('uploads/books');
                    }
                    let originalPath = 'uploads/books'+ '/' + new Date().getTime() + AppUtil.getFileNameByFileObject(attachment);
                    fs.rename(attachment.path, originalPath, function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            req.body.attachment = originalPath;
                            Book.findByIdAndUpdate(req.body._id, req.body, (err, result) => {
                                if (err) {
                                    res.sendStatus(500);
                                } else {
                                    let response = Response.createResponse(Response.RequestStatus.Success, "Book updated.", result);
                                    res.status(200).json(response);
                                }
                            });
                        }
                    });
                } else{
                    Book.findByIdAndUpdate(req.body._id, req.body, function (err, results) {
                        if (err) {
                        let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else {
                            let message = "Book updated Successfully";
                            let response = Response.createResponse(Response.RequestStatus.Success, message, results);
                            res.status(200).json(response);
                        }
                    });
                }
    } else {
        res.sendStatus(400);
    }
})

/**
 * books-category
 * @purpose: This Rest API  used to  get all book
 * @method: GET
 */
 router.get("/category/list", isAuth,(req, res, next) => {
    const filter = {};
    BookCategory.find(filter, (err, success) => {
        if(err){
            res.sendStatus(500);
        } else{
            response = Response.createResponse(Response.RequestStatus.Success, "No books found.", success);
            res.status(200).json(response);
        }
    });
  
})
/**
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
 router.post("/category",isAuth,(req, res, next) => {
    let label = req.body.label;
    if (label) {
          BookCategory.countDocuments({ label: label }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Book type already available with this name.');
                res.json(200, response);
            } else {
                    let book = new BookCategory(req.body);
                    book.save(function (err, results) {
                        if (err) {
                        let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else {
                            let message = "Category Saved.";
                            let response = Response.createResponse(Response.RequestStatus.Success, message);
                            res.status(200).json(response);
                        }
                    });
            }
        });
        
      
    } else {
        res.sendStatus(400);
    }
})
/**
 * Book
 * @purpose: This Rest API  used to  remove Book
 * @method: POST
 */
 router.get("/category/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        BookCategory.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "Book Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * Book
 * @purpose: This Rest API  used to update Book category
 * @method: Update
 */
 router.post("/category/update", isAuth,(req, res, next) => {
    let label = req.body.label;
    if (label && req.body._id) {
                    Book.findByIdAndUpdate(req.body._id, req.body, function (err, results) {
                        if (err) {
                        let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else {
                            let message = "Book Category updated Successfully";
                            let response = Response.createResponse(Response.RequestStatus.Success, message, results);
                            res.status(200).json(response);
                        }
                    });
    } else {
        res.sendStatus(400);
    }
})
module.exports = router;