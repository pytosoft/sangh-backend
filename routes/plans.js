const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let Plans = require('../entity/plans').Plans;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({ dest: 'uploads/' });
let fs = require('fs');
const isAuth = require('../middleware/is-auth')

/**
 * Plans
 * @purpose: This Rest API  used to  get Plans list
 * @method: GET
 */
router.get("/list", isAuth,(req, res, next) => {
    Plans.find({}, function (err, planList) {
            if (err) {
                console.log('error ', err);
                res.sendStatus(500);
            } else if (planList) {
                response = Response.createResponse(Response.RequestStatus.Success, "plan list", planList);
                res.status(200).json(response);
            } else {
                response = Response.createResponse(Response.RequestStatus.Success, "No plan found.", []);
                res.status(200).json(response);
            }
        });
})
router.get("/list/names",isAuth, (req, res, next) => {
    let response;
    let sortBy = req.query.sortBy;
    let limit = req.query.limit || 1000;
    let pageNo = req.query.pageNo || 1;
    let pipe = [];
    pipe.push({ $limit: limit });
    pipe.push({ $project: {name: 1, planId: 1}});
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
    Plans.aggregate(
        pipe, function (err, planList) {
            if (err) {
                console.log('error ', err);
                res.sendStatus(500);
            } else if (planList) {
                response = Response.createResponse(Response.RequestStatus.Success, "user list", planList);
                res.status(200).json(response);
            } else {
                response = Response.createResponse(Response.RequestStatus.Success, "No user found.", []);
                res.status(200).json(response);
            }
        });
})
/**
 * Plans
 * @purpose: This Rest API  used to  save Plan
 *  * @method: POST
 */
router.post("/", isAuth,(req, res, next) => {
    let name = req.body.name;
    if (name) {
        Plans.countDocuments({ name: name }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Plan Name Already exits.');
                res.json(200, response);
            } else {
                Plans.count((err, count) => {
                    if (err) {
                        let response = Response.createResponse(0, err.message);
                        res.status(500).json(response);
                    } else {
                        req.body.planId = count + 1;
                        let plan = new Plans(req.body);
                        plan.save(function (err, results) {
                            if (err) {
                                let response = Response.createResponse(0, err.message);
                                res.status(500).json(response);
                            } else {
                                let message = "Plan saved";
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
router.get("/getPlanById/:id", isAuth,(req, res, next) => {
    const id = req.params.id;
    if (id) {
        Plans.findById(id, function (err, user) {
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
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/update", isAuth,(req, res, next) => {
    if (req.body._id) {
        req.body.updateDate = new Date().getTime();
        delete req.body.planId;
        Plans.findByIdAndUpdate(req.body._id, req.body, (err, results) => {
            if (err) {
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else {
                let message = "Plan updated successfully";
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
        Plans.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            } else {
                let message = "Plan Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
module.exports = router;