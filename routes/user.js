const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let User = require('../entity/user').User;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({ dest: 'uploads/' });
let fs = require('fs');
const isAuth = require('../middleware/is-auth');
const { Maker } = require('../entity/maker');

/**
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: GET
 */
router.get("/list",isAuth, (req, res, next) => {
    let response;
    let sortBy = req.query.sortBy;
    let limit = req.query.limit || 100;
    let pageNo = req.query.pageNo || 1;
    let pipe = [];
    pipe.push({ $limit: limit });
    pipe.push({ $skip: ((pageNo - 1) * limit) });
    if (AppUtil.isNumber(sortBy)) {
        let sortQ = {};
        switch (sortBy) {
            case 0://rating
                sortQ = { avgRating: -1 };
                break;
            case 1://popular
                sortQ = { avgRating: -1 };
                break;
            case 2://latest
                sortQ = { createDate: -1 };
                break;
            case 3://free
                sortQ = { avgRating: -1 };
                break;
        }
        pipe.push({ "$sort": sortQ });
    }
    User.aggregate(
        pipe, function (err, userList) {
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
})
router.get("/maker/list",isAuth, (req, res, next) => {
    let response;
    let sortBy = req.query.sortBy;
    let limit = req.query.limit || 1000;
    let pageNo = req.query.pageNo || 1;
    let pipe = [];
    pipe.push({ $limit: limit });
    pipe.push({ $skip: ((pageNo - 1) * limit) });
    if (AppUtil.isNumber(sortBy)) {
        let sortQ = {};
        switch (sortBy) {
            case 0://rating
                sortQ = { avgRating: -1 };
                break;
            case 1://popular
                sortQ = { avgRating: -1 };
                break;
            case 2://latest
                sortQ = { createDate: -1 };
                break;
            case 3://free
                sortQ = { avgRating: -1 };
                break;
        }
        pipe.push({ "$sort": sortQ });
    }
    Maker.aggregate(
        pipe, function (err, userList) {
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
})
/**
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/", isAuth ,(req, res, next) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    if (!AppUtil.isStringEmpty(name) && !AppUtil.isStringEmpty(email) && !AppUtil.isStringEmpty(password) && email) {
        //check same email already exist
        User.countDocuments({ email: email }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Email already registered.');
                res.json(400, response);
            } else {
                req.body.email = email.toLowerCase();
                User.count((err, count) => {
                    if(!err){
                        req.body.id = count+1;
                        req.body.pendingAmount = 0;
                        req.body.isSuperAdmin = false;
                        req.body.active = true;
                        let user = new User(req.body);
                        user.save(function (err, results) {
                            if (err) {
                                let response = Response.createResponse(0, err.message);
                                res.status(500).json(response);
                            } else {
                                let message = "User registered Successfully";
                                let response = Response.createResponse(Response.RequestStatus.Success, message);
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
router.post("/maker/", isAuth ,(req, res, next) => {
    let name = req.body.name;
    let password = req.body.password;
    if (!AppUtil.isStringEmpty(name) && !AppUtil.isStringEmpty(password)) {
        //check same email already exist
        Maker.countDocuments({ name: name }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Name already registered.');
                res.json(400, response);
            } else {
                req.body.name = name.toLowerCase();
                Maker.count((err, count) => {
                    if(!err){
                        req.body.id = count+1;
                        req.body.pendingAmount = 0;
                        req.body.isSuperAdmin = false;
                        req.body.active = true;
                        let user = new Maker(req.body);
                        user.save(function (err, results) {
                            if (err) {
                                let response = Response.createResponse(0, err.message);
                                res.status(500).json(response);
                            } else {
                                let message = "Maker registered Successfully";
                                let response = Response.createResponse(Response.RequestStatus.Success, message);
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
router.get("/getUserProfile/:id", isAuth, (req, res, next) => {
    const id = req.params.id;
    if (id) {
        User.findById(id, function (err, user) {
            if (err) {
                let response = Response.createResponse(Response.RequestStatus.Error, err.message);
                res.status(500).json(response);
            } else {
                let response = Response.createResponse(Response.RequestStatus.Success, "Success", user);
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
router.post('/uploadProfilePic', isAuth, upload.single('file'), (req, res, next) => {
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
                    image: originalPath,
                };
                User.update({ _id: userID }, update, function (err, done) {
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
router.post("/update", isAuth, (req, res, next) => {
    if (req.body._id) {
        req.body.updateDate = new Date().getTime();
        delete req.body.email;
        delete req.body.isSuperAdmin;
        User.findByIdAndUpdate(req.body._id, req.body, (err, results) => {
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
router.post("/maker/update", isAuth, (req, res, next) => {
    if (req.body._id) {
        req.body.updateDate = new Date().getTime();
        delete req.body.email;
        delete req.body.isSuperAdmin;
        Maker.findByIdAndUpdate(req.body._id, req.body, (err, results) => {
            if (err) {
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else {
                let message = "Maker updated Successfully";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * depositAmountRequest
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
 router.post("/depositAmountRequest", isAuth, (req, res, next) => {
    if (req.body.id) {
        User.find({isSuperAdmin : true}, (err, user) => {
            if(err){
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else{
                req.body.date = new Date().getTime();
                req.body.isVerifyed = false;
                user[0].depositAmountRequest.push(req.body);                
                User.findByIdAndUpdate(user[0]._id, { depositAmountRequest : user[0].depositAmountRequest}, (err, success) => {
                    if(err){
                        let response = Response.createResponse(0, err.message);
                        res.status(500).json(response);
                    } else{
                        let message = "Your Request has been sent for approval.";
                        let response = Response.createResponse(Response.RequestStatus.Success, message);
                        res.status(200).json(response);
                    }
                })
               
            }
        })
    } else {
        res.sendStatus(400);
    }
})
/**
* verifyAmount
* @purpose: This Rest API  used to  get users list
* @method: POST
*/
router.post("/verifyAmount", isAuth, (req, res, next) => {
   if (req.body.adminId) {
       User.findById(req.body.adminId, (err, superAdmin) => {
           if(err){
               let response = Response.createResponse(0, err.message);
               res.status(500).json(response);
           } else{
            const depositAmount = superAdmin.depositAmount + Number(req.body.depositAmount)   
            superAdmin.depositAmountRequest.forEach(element => {
                if(element.id === req.body.id){
                    element.isVerifyed = true;
                }
            });          
               User.findByIdAndUpdate(req.body.adminId, { depositAmount : depositAmount, depositAmountRequest : superAdmin.depositAmountRequest}, (err, success) => {
                   if(err){
                       let response = Response.createResponse(0, err.message);
                       res.status(500).json(response);
                   } else{
                    User.findById(req.body.id, (err, admin) => {
                        if(err){
                            let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else{
                            User.findByIdAndUpdate(req.body.id, { pendingAmount : admin.pendingAmount - Number(req.body.depositAmount)}, (error, success) => {
                                if(error){
                                    let response = Response.createResponse(0, err.message);
                                    res.status(500).json(response);
                                } else{
                                    let message = "Approved.";
                                    let response = Response.createResponse(Response.RequestStatus.Success, message);
                                    res.status(200).json(response);
                                }
                            })
                        }
                    })
                   }
               })
              
           }
       })
   } else {
       res.sendStatus(400);
   }
})
/**
 * user
 * @purpose: This Rest API  used to  remove user
 * @method: POST
 */
 router.get("/deleteById", isAuth, (req, res, next) => {
    let id = req.query.id;
    if (id) {
        const active = req.query.active === true || req.query.active === 'true';
        User.findByIdAndUpdate(id, { active: active }, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = active ? 'User Activate.' : 'User Deactived.';
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
router.get("/maker/deleteById", isAuth, (req, res, next) => {
    let id = req.query.id;
    if (id) {
        Maker.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "User "+ req.query.active === true ? 'Deactived.' : 'Activate.';
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: GET
 */
 router.get("/list/names",isAuth, (req, res, next) => {
    let response;
    let sortBy = req.query.sortBy;
    let limit = req.query.limit || 1000;
    let pageNo = req.query.pageNo || 1;
    let pipe = [];
    pipe.push({ $limit: limit });
    pipe.push({ $project: {name: 1, _id: 1}});
    pipe.push({ $skip: ((pageNo - 1) * limit) });
    if (AppUtil.isNumber(sortBy)) {
        let sortQ = {};
        switch (sortBy) {
            case 0://rating
                sortQ = { avgRating: -1 };
                break;
            case 1://popular
                sortQ = { avgRating: -1 };
                break;
            case 2://latest
                sortQ = { createDate: -1 };
                break;
            case 3://free
                sortQ = { avgRating: -1 };
                break;
        }
        pipe.push({ "$sort": sortQ });
    }
    User.aggregate(
        pipe, function (err, userList) {
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
})

module.exports = router;
