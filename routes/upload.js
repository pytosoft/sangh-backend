const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let Subscriber = require('../entity/subscribers').Subscriber;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({ dest: 'uploads/' });
let fs = require('fs');
const isAuth = require('../middleware/is-auth')
const excelToJson = require('convert-excel-to-json');
let Subscription = require('../entity/subcription').Subscription;

/**
 * uploadUserPhoto
 */
router.post('/subcribers', isAuth, upload.single('file'),  (req, res, next) => {
    let userID = req.body.userID;
    let file = req.file;
    if (file && AppUtil.isObjectId(userID)) {
        if (!fs.existsSync('excel')) {
            fs.mkdirSync('excel');
        }
        if (!fs.existsSync('excel/' + userID)) {
            fs.mkdirSync('excel/' + userID);
        }
        let originalPath = 'excel/' + userID + '/' + new Date().getTime() + AppUtil.getFileNameByFileObject(file);
        fs.rename(file.path, originalPath, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                const result = excelToJson({
                    sourceFile: originalPath,
                    sheets:[{
                        name: 'users',
                        header:{
                            rows: 1
                        },
                        columnToKey: {
                            A: 'name',
                            B: 'fatherName',
                            C: 'email',
                            D: 'locality',
                            E: 'landmark',
                            F: 'address',
                            G: 'city',
                            H: 'state',
                            I: 'pinCode',
                            J: 'mobile',
                            K: 'active',
                            L: 'plan',
                            M: 'planId',
                            N: 'startDate',
                            O: 'endDate',
                            P: 'duration',
                            Q: 'secondaryPhone',
                            R: 'price'
                        }
                    }]
                });

                Subscriber.count((err, count) => {
                    if (err) {
                        let response = Response.createResponse(0, err.message);
                        res.status(500).json(response);
                    } else {
                        result['users'].forEach(element => {
                            element.createdBy = userID;
                            element.subscriberId = count + 1;
                            count = count + 1;
			    element.createDate = new Date().getTime();
			    element.updateDate = new Date().getTime();
                element.active = element.active == 'true' ? true : false;
                        });
                        Subscriber.collection.insertMany(result['users'], (req,rese) => {
                            console.log(rese.ops)
                            var subs = [];
                            for(var i=0; i < result['users'].length; i++){
                            const ele = result['users'][i];
                            console.log(ele.startDate)
                            let temp = {
                            "name": ele.plan,
                            "duration": ele.duration,
                            "price": ele.price,
                            "description":"overview",
                            "planId": ele.planId,
                            "updateDate": new Date().getTime(),
                            "createDate": new Date().getTime(),
                            "new":true,
                            "startDate": new Date(ele.startDate).getTime(),
                            "endDate":new Date(ele.endDate).getTime(),
                            "active": ele.active,
                            "deliveryAddress":{
                                "name": ele.name,
                                "mobile": ele.mobile,
                                "pinCode": ele.pinCode,
                                "locality": ele.locality,
                                "address": ele.address,
                                "city": ele.city,
                                "state": ele.state,
                                "landmark": ele.landmark,
                                "secondaryPhone": ele.secondaryPhone
                            },
                                "subscriberId": rese.ops[i]["_id"].toString(),
                                "createdBy": userID
                            }
                            console.log(rese.ops[i]._id)
                            subs.push(temp)
                            }
                            Subscription.collection.insertMany(subs, (req,resse) => {
                                let response = Response.createResponse(Response.RequestStatus.Success, "Data Imported...");
                                res.status(200).json(response);    
                            })
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
 * uploadUserPhoto
 */
router.post('/subcribers', isAuth, upload.single('file'),  (req, res, next) => {
    let userID = req.body.userID;
    let file = req.file;
    if (file && AppUtil.isObjectId(userID)) {
        if (!fs.existsSync('excel')) {
            fs.mkdirSync('excel');
        }
        if (!fs.existsSync('excel/' + userID)) {
            fs.mkdirSync('excel/' + userID);
        }
        let originalPath = 'excel/' + userID + '/' + new Date().getTime() + AppUtil.getFileNameByFileObject(file);
        fs.rename(file.path, originalPath, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                const result = excelToJson({
                    sourceFile: originalPath,
                    sheets:[{
                        name: 'users',
                        header:{
                            rows: 1
                        },
                        columnToKey: {
                            A: 'name',
                            B: 'fatherName',
                            C: 'email',
                            D: 'locality',
                            E: 'landmark',
                            F: 'address',
                            G: 'city',
                            H: 'state',
                            I: 'pinCode',
                            J: 'mobile',
                            K: 'active',
                            L: 'plan',
                            M: 'planId',
                            N: 'startDate',
                            O: 'endDate',
                            P: 'duration',
                            Q: 'secondaryPhone',
                            R: 'price'
                        }
                    }]
                });

                Subscriber.count((err, count) => {
                    if (err) {
                        let response = Response.createResponse(0, err.message);
                        res.status(500).json(response);
                    } else {
                        result['users'].forEach(element => {
                            element.createdBy = userID;
                            element.subscriberId = count + 1;
                            count = count + 1;
                element.createDate = new Date().getTime();
                element.updateDate = new Date().getTime();
                element.active = element.active == 'true' ? true : false;
                        });
                        Subscriber.collection.insertMany(result['users'], (req,rese) => {
                            console.log(rese.ops)
                            var subs = [];
                            for(var i=0; i < result['users'].length; i++){
                            const ele = result['users'][i];
                            console.log(ele.startDate)
                            let temp = {
                            "name": ele.plan,
                            "duration": ele.duration,
                            "price": ele.price,
                            "description":"overview",
                            "planId": ele.planId,
                            "updateDate": new Date().getTime(),
                            "createDate": new Date().getTime(),
                            "new":true,
                            "startDate": new Date(ele.startDate).getTime(),
                            "endDate":new Date(ele.endDate).getTime(),
                            "active": ele.active,
                            "deliveryAddress":{
                                "name": ele.name,
                                "mobile": ele.mobile,
                                "pinCode": ele.pinCode,
                                "locality": ele.locality,
                                "address": ele.address,
                                "city": ele.city,
                                "state": ele.state,
                                "landmark": ele.landmark,
                                "secondaryPhone": ele.secondaryPhone
                            },
                                "subscriberId": rese.ops[i]["_id"].toString(),
                                "createdBy": userID
                            }
                            console.log(rese.ops[i]._id)
                            subs.push(temp)
                            }
                            Subscription.collection.insertMany(subs, (req,resse) => {
                                let response = Response.createResponse(Response.RequestStatus.Success, "Data Imported...");
                                res.status(200).json(response);    
                            })
                        });
                    }
                })
            }
        });
    } else {
        res.sendStatus(400);
    }
})
module.exports = router;
