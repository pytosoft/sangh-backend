const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let News = require('../entity/news').News;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({dest: 'uploads/'});
let fs = require('fs');
const isAuth = require('../middleware/is-auth')

/**
 * documents
 * @purpose: This Rest API  used to  get all documents
 * @method: GET
 */
router.get("/list", (req, res, next) => {
    let response;
    News.find({ active : true}, function (err, newsList) {
            if (err) {
                console.log('error ', err);
                res.sendStatus(500);
            } else if (newsList) {
                response = Response.createResponse(Response.RequestStatus.Success, "news list", newsList);
                res.status(200).json(response);
            } else {
                response = Response.createResponse(Response.RequestStatus.Success, "No news found.", []);
                res.status(200).json(response);
            }
        });
})
/**
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/", upload.single('attachment'), (req, res, next) => {
    let newsName = req.body.newsName;
    let attachment = req.file;
    if (newsName) {
        News.countDocuments({ newsName: newsName }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'news already available with this name.');
                res.json(200, response);
            } else {
                if(attachment){
                    if (!fs.existsSync('uploads')) {
                        fs.mkdirSync('uploads');
                    }
                    if (!fs.existsSync('uploads/news')) {
                        fs.mkdirSync('uploads/news');
                    }
                    let originalPath = 'uploads/news'+ '/' + new Date().getTime() + AppUtil.getFileNameByFileObject(attachment);
                    fs.rename(attachment.path, originalPath, function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            req.body.attachment = originalPath;
                            let news = new News(req.body);
                            news.save((err, result) => {
                                if (err) {
                                    res.sendStatus(500);
                                } else {
                                    let response = Response.createResponse(Response.RequestStatus.Success, "News saved.", result);
                                    res.status(200).json(response);
                                }
                            });
                        }
                    });
                } else{
                    let news = new News(req.body);
                    news.save(function (err, results) {
                        if (err) {
                        let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else {
                            let message = "news registered Successfully";
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
 * document
 * @purpose: This Rest API  used to  remove document
 * @method: POST
 */
 router.get("/deleteById", (req, res, next) => {
    let id = req.query.id;
    if (id) {
        News.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "News Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * document
 * @purpose: This Rest API  used to update document
 * @method: Update
 */
 router.post("/update", upload.single('attachment'), (req, res, next) => {
    let attachment = req.file;
    if (req.body._id) {
                if(attachment){
                    if (!fs.existsSync('uploads')) {
                        fs.mkdirSync('uploads');
                    }
                    if (!fs.existsSync('uploads/news')) {
                        fs.mkdirSync('uploads/news');
                    }
                    let originalPath = 'uploads/news'+ '/' + new Date().getTime() + AppUtil.getFileNameByFileObject(attachment);
                    fs.rename(attachment.path, originalPath, function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            req.body.attachment = originalPath;
                            News.findByIdAndUpdate(req.body._id, req.body, (err, result) => {
                                if (err) {
                                    res.sendStatus(500);
                                } else {
                                    let response = Response.createResponse(Response.RequestStatus.Success, "document updated.", result);
                                    res.status(200).json(response);
                                }
                            });
                        }
                    });
                } else{
                    News.findByIdAndUpdate(req.body._id, req.body, function (err, results) {
                        if (err) {
                        let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else {
                            let message = "News updated Successfully";
                            let response = Response.createResponse(Response.RequestStatus.Success, message, results);
                            res.status(200).json(response);
                        }
                    });
                }
    } else {
        res.sendStatus(400);
    }
})
module.exports = router;