const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let Subscriber = require('../entity/subscribers').Subscriber;
let Subscription = require('../entity/subcription').Subscription;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({ dest: 'uploads/' });
let fs = require('fs');
const isAuth = require('../middleware/is-auth')
const User = require('../entity/user').User;
/**
 * Subscribers
 * @purpose: This Rest API  used to  get Subscriber list
 * @method: GET
 */
router.get("/list/:id",isAuth, (req, res, next) => {
    let response;
    const id = req.params.id;
    if (id) {
    User.findById(id, (err, admin) => {
        if(err){
            res.sendStatus(500);
        } else{
            if(admin.isSuperAdmin){
                Subscriber.find(function (err, userList) {
                    if (err) {
                        console.log('error ', err);
                        res.sendStatus(500);
                    } else if (userList) {
                        response = Response.createResponse(Response.RequestStatus.Success, "user list", userList);
                        res.status(200).json(response);
                    } else {
                        response = Response.createResponse(Response.RequestStatus.Success, "No user found.", []);
                        res.status(200).json(response);
                    }
                });
            } else{
                Subscriber.find({createdBy: admin._id}, function (err, userList) {
                        if (err) {
                            console.log('error ', err);
                            res.sendStatus(500);
                        } else if (userList) {
                            response = Response.createResponse(Response.RequestStatus.Success, "user list", userList);
                            res.status(200).json(response);
                        } else {
                            response = Response.createResponse(Response.RequestStatus.Success, "No user found.", []);
                            res.status(200).json(response);
                        }
                    });
            }
        }
    })
    
    } else{
        res.sendStatus(400);
    }
})

/**
 * subscriber
 * @purpose: This Rest API  used to  get subscriber list
 * @method: POST
 */
router.post("/",isAuth, (req, res, next) => {
    let name = req.body.name;
    let mobile = req.body.mobile;
    if (name && mobile) {
        Subscriber.countDocuments({ mobile: mobile}, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Mobile Number already registered.');
                res.json(400, response);
            } else {
                Subscriber.count((err, count) => {
                    if (err) {
                        let response = Response.createResponse(0, err.message);
                        res.status(500).json(response);
                    } else {
                        req.body.subscriberId = count + 1;
                        let subscriber = new Subscriber(req.body);
                        subscriber.save(function (err, results) {
                            if (err) {
                                let response = Response.createResponse(0, err.message);
                                res.status(500).json(response);
                            } else {
                                let message = "Subscriber registered Successfully";
                                const id = {
                                    id: results._id
                                }
                                let response = Response.createResponse(Response.RequestStatus.Success, message, id);
                                res.status(200).json(response);
                            }
                        });
                    }
                })


            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * get user by Id
 */
router.get("/getUserProfile/:id",isAuth, (req, res, next) => {
    const id = req.params.id;
    if (id) {
        Subscriber.findById(id, function (err, user) {
            if (err) {
                let response = Response.createResponse(Response.RequestStatus.Error, err.message);
                res.status(500).json(response);
            } else {
                Subscription.find({subscriberId :  id}, (err, sucees) => {
                    if (err) {
                        let response = Response.createResponse(Response.RequestStatus.Error, err.message);
                        res.status(500).json(response);
                    } else{
                       let result = {};
                       result._doc = user;
                       result.subcriptions = sucees;
                       
                        let response = Response.createResponse(Response.RequestStatus.Success, "Success", result);
                        res.status(200).json(response);
                    }
                })
               
            }
        }
        );
    } else {
        res.sendStatus(400);
    }
})
/**
 * get user by Id
 */
 router.get("/getSubcriberByMobile/:mobile", isAuth,(req, res, next) => {
    const mobile = req.params.mobile;
    if (mobile) {
        Subscriber.find({mobile : mobile}, function (err, user) {
            if (err) {
                let response = Response.createResponse(Response.RequestStatus.Error, 'User not found with this mobile.');
                res.status(400).json(response);
            }  else if(user.length == 0) {
                let response = Response.createResponse(Response.RequestStatus.Error, 'User not found with this mobile.');
                res.status(400).json(response);
            } else {
                const subs = {
                    id: user[0]._id
                }
                let response = Response.createResponse(Response.RequestStatus.Success, "Success", subs);
                res.status(200).json(response);
            }
        }
        );
    } else {
        res.sendStatus(400);
    }
})
/**
 * uploadUserPhoto
 */
router.post('/uploadProfilePic', isAuth,upload.single('file'), (req, res, next) => {
    let userID = req.body.userID;
    let file = req.file;
    if (file && AppUtil.isObjectId(userID)) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        if (!fs.existsSync('uploads/' + userID)) {
            fs.mkdirSync('uploads/' + userID);
        }
        let originalPath = 'uploads/' + userID + '/' + new Date().getTime() + AppUtil.getFileNameByFileObject(file);
        fs.rename(file.path, originalPath, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                let update = {
                    image: originalPath
                };
                Subscriber.update({ _id: userID }, update, function (err, done) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        let response = Response.createResponse(Response.RequestStatus.Success, "user image Updated.", originalPath);
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
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/update", isAuth,(req, res, next) => {
    if (req.body._id) {
        req.body.updateDate = new Date().getTime();
        delete req.body.email;
        Subscriber.findByIdAndUpdate(req.body._id, req.body, (err, results) => {
            if (err) {
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else {
                let message = "Admin registered Successfully";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * user
 * @purpose: This Rest API  used to  remove user
 * @method: POST
 */
router.get("/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        Subscriber.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            } else {
                let message = "User Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * Subscribers
 * @purpose: This Rest API  used to  get Subscriber list
 * @method: GET
 */
 router.post("/search",isAuth, (req, res, next) => {
    let response;
    let query = {}
    if (req.body.admin)
        query.createdBy = req.body.admin
    if (req.body.state)
        query.state = req.body.state  
    if (req.body.city)
        query.city = req.body.city  
    if (req.body.startDate){
        query.createDate = {
            $gte: new Date(req.body.startDate), 
            $lt: new Date(req.body.endDate)
        }
    }
   if(req.body.mobile){
    query.mobile = req.body.mobile
   }
   if(req.body.maker){
    query.maker = { "$regex" : req.body.maker , "$options" : "i"}
   }
   if(req.body.name){
    query.name = { "$regex" : req.body.name , "$options" : "i"}
   }
   if(req.body.voucherNumber){
    query.voucherNumber = req.body.voucherNumber
   }
    query.active = req.body.status;
    const id = req.body.admin
    if(id){
        User.findById(id, (err, admin) => {
            if(err){
                res.sendStatus(500);
            } else{
                console.log(admin)
                if(admin.isSuperAdmin){
                    console.log(admin)
                    console.log("enter id "+id)
                    console.log("response id "+ admin._id)
                    if(id == admin._id){
                        delete query.createdBy;
                        console.log("removed")
                    }
                    console.log(query)
                    if(req.body.planId || req.body.bookId){
                        let filterQuery = {};
                        if(req.body.planId)
                        filterQuery.planId = Number(req.body.planId)
                        if(req.body.bookId)
                        filterQuery.bookId = req.body.bookId
                        Subscription.find(filterQuery, { subscriberId: 1,  _id: 0 }, (err, subsIds) => {
                            if(err){
                                res.sendStatus(500);
                            } else{
                                query._id = { $in: subsIds.map(res => res.subscriberId) }
                                Subscriber.find(query, function (err, userList) {
                                    if (err) {
                                        console.log('error ', err);
                                        res.sendStatus(500);
                                    } else if (userList) {
                                        response = Response.createResponse(Response.RequestStatus.Success, "user list", userList);
                                        res.status(200).json(response);
                                    } else {
                                        response = Response.createResponse(Response.RequestStatus.Success, "No user found.", []);
                                        res.status(200).json(response);
                                    }
                                });
                            }
                        })
                    } else {
                        Subscriber.find(query, function (err, userList) {
                            if (err) {
                                console.log('error ', err);
                                res.sendStatus(500);
                            } else if (userList) {
                                response = Response.createResponse(Response.RequestStatus.Success, "user list", userList);
                                res.status(200).json(response);
                            } else {
                                response = Response.createResponse(Response.RequestStatus.Success, "No user found.", []);
                                res.status(200).json(response);
                            }
                        });
                    }
                } else{
                    query.createdBy = admin._id;
                    if(req.body.planId || req.body.bookId){
                        let filterQuery = {};
                        if(req.body.planId)
                        filterQuery.planId = Number(req.body.planId)
                        if(req.body.bookId)
                        filterQuery.bookId = req.body.bookId
                        Subscription.find(filterQuery, (err, subsIds) => {
                            if(err){
                                res.sendStatus(500);
                            } else{
                                query._id = { $in: subsIds.map(res => res.subscriberId) }
                                Subscriber.find(query, function (err, userList) {
                                    if (err) {
                                        console.log('error ', err);
                                        res.sendStatus(500);
                                    } else if (userList) {
                                        response = Response.createResponse(Response.RequestStatus.Success, "user list", userList);
                                        res.status(200).json(response);
                                    } else {
                                        response = Response.createResponse(Response.RequestStatus.Success, "No user found.", []);
                                        res.status(200).json(response);
                                    }
                                });
                            }
                        })
                    } else {
                    Subscriber.find(query, function (err, userList) {
                            if (err) {
                                console.log('error ', err);
                                res.sendStatus(500);
                            } else if (userList) {
                                response = Response.createResponse(Response.RequestStatus.Success, "user list", userList);
                                res.status(200).json(response);
                            } else {
                                response = Response.createResponse(Response.RequestStatus.Success, "No user found.", []);
                                res.status(200).json(response);
                            }
                        });
                }
            }
            }
        })
    } else {
        res.status(400).json("Bad Data")
    }
})
module.exports = router;
