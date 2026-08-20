const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let Book = require('../entity/book').Book;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({dest: 'uploads/'});
let fs = require('fs');
let BookCategory = require('../entity/book-category').BookCategory;
let States = require('../entity/states').States;
const isAuth = require('../middleware/is-auth')

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
 router.get("/states/list", isAuth,(req, res, next) => {
    const filter = {};
 States.find().distinct('state', function(error, ids) {
     response = Response.createResponse(Response.RequestStatus.Success, "No states found.", ids);
            res.status(200).json(response);});
  
})
/**
 * books-category
 * @purpose: This Rest API  used to  get all book
 * @method: GET
 */
 router.get("/dist/list", isAuth,(req, res, next) => {
 States.find().distinct('district', function(error, ids) {
     response = Response.createResponse(Response.RequestStatus.Success, "No states found.", ids);
            res.status(200).json(response);});
  
})
/**
 * books-category
 * @purpose: This Rest API  used to  get all book
 * @method: GET
 */
 router.get("/distByState", isAuth,(req, res, next) => {
 let state = { $in: req.query.state.split(',') };
 States.find({state: state}).distinct('district', function(error, ids) {
     response = Response.createResponse(Response.RequestStatus.Success, "No states found.", ids);
            res.status(200).json(response);});
  
})

/**
 * states / districts
 * @purpose: Create a state, or a district under an existing state
 * @method: POST
 */
router.post("/states", isAuth, (req, res) => {
    const state = typeof req.body.state === 'string' ? req.body.state.trim() : '';
    const district = typeof req.body.district === 'string' ? req.body.district.trim() : '';
    if (!state) {
        res.sendStatus(400);
        return;
    }

    const query = district ? { state, district } : { state };
    const failMessage = district
        ? 'District already available for this state.'
        : 'State already available.';
    const successMessage = district ? 'District saved.' : 'State saved.';

    States.countDocuments(query, function (err, count) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        if (count) {
            res.status(200).json(Response.createResponse(Response.RequestStatus.Fail, failMessage));
            return;
        }
        const item = new States(district ? { state, district } : { state });
        item.save(function (saveErr, result) {
            if (saveErr) {
                res.status(500).json(Response.createResponse(0, saveErr.message));
                return;
            }
            res.status(200).json(Response.createResponse(Response.RequestStatus.Success, successMessage, result));
        });
    });
})

/**
 * states
 * @purpose: Rename a state on all matching location records
 * @method: POST
 */
router.post("/states/update", isAuth, (req, res) => {
    const oldState = typeof req.body.oldState === 'string' ? req.body.oldState.trim() : '';
    const state = typeof req.body.state === 'string' ? req.body.state.trim() : '';
    if (!oldState || !state) {
        res.sendStatus(400);
        return;
    }
    if (oldState === state) {
        res.status(200).json(Response.createResponse(Response.RequestStatus.Success, "State updated.", { state }));
        return;
    }
    States.countDocuments({ state }, function (err, count) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        if (count) {
            res.status(200).json(Response.createResponse(Response.RequestStatus.Fail, 'State already available.'));
            return;
        }
        States.updateMany({ state: oldState }, { $set: { state, updateDate: new Date().getTime() } }, function (updateErr, result) {
            if (updateErr) {
                res.status(500).json(Response.createResponse(0, updateErr.message));
                return;
            }
            res.status(200).json(Response.createResponse(Response.RequestStatus.Success, "State updated.", result));
        });
    });
})

/**
 * districts
 * @purpose: Rename a district under a state
 * @method: POST
 */
router.post("/dist/update", isAuth, (req, res) => {
    const state = typeof req.body.state === 'string' ? req.body.state.trim() : '';
    const oldDistrict = typeof req.body.oldDistrict === 'string' ? req.body.oldDistrict.trim() : '';
    const district = typeof req.body.district === 'string' ? req.body.district.trim() : '';
    if (!state || !oldDistrict || !district) {
        res.sendStatus(400);
        return;
    }
    if (oldDistrict === district) {
        res.status(200).json(Response.createResponse(Response.RequestStatus.Success, "District updated.", { state, district }));
        return;
    }
    States.countDocuments({ state, district }, function (err, count) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        if (count) {
            res.status(200).json(Response.createResponse(Response.RequestStatus.Fail, 'District already available for this state.'));
            return;
        }
        States.updateMany(
            { state, district: oldDistrict },
            { $set: { district, updateDate: new Date().getTime() } },
            function (updateErr, result) {
                if (updateErr) {
                    res.status(500).json(Response.createResponse(0, updateErr.message));
                    return;
                }
                res.status(200).json(Response.createResponse(Response.RequestStatus.Success, "District updated.", result));
            }
        );
    });
})

/**
 * states
 * @purpose: Delete a state and its districts
 * @method: GET
 */
router.get("/states/delete", isAuth, (req, res) => {
    const state = typeof req.query.state === 'string' ? req.query.state.trim() : '';
    if (!state) {
        res.sendStatus(400);
        return;
    }
    States.deleteMany({ state }, function (err) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.status(200).json(Response.createResponse(Response.RequestStatus.Success, "State removed."));
    });
})

/**
 * districts
 * @purpose: Delete a district under a state
 * @method: GET
 */
router.get("/dist/delete", isAuth, (req, res) => {
    const state = typeof req.query.state === 'string' ? req.query.state.trim() : '';
    const district = typeof req.query.district === 'string' ? req.query.district.trim() : '';
    if (!state || !district) {
        res.sendStatus(400);
        return;
    }
    States.deleteMany({ state, district }, function (err) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.status(200).json(Response.createResponse(Response.RequestStatus.Success, "District removed."));
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