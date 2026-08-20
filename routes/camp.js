const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let CampPCate = require('../entity/Camp_Participants_Category_Type').CampPCate;
let CampType = require('../entity/camp-type').CampType;
let BatchMaster = require('../entity/batch-master').BatchMaster;
let VolunteerMasters = require('../entity/volunteer-master').VolunteerMaster;
let CampMaster = require('../entity/camp-master').CampMaster;
const Response = require('../config/response')
const multer = require('multer');
let upload = multer({dest: 'uploads/'});
let fs = require('fs');
const isAuth = require('../middleware/is-auth')
const {Book} = require("../entity/book");
const {Subscriber} = require("../entity/subscribers");

/**
 * books
 * @purpose: This Rest API  used to  get all book
 * @method: GET
 */
router.get("/participants-type/list", isAuth,(req, res, next) => {
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
    CampPCate.aggregate(
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
router.get("/camp-type/list", isAuth,(req, res, next) => {
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
    CampType.aggregate(
        pipe, function (err, booksList) {
            if (err) {
                console.log('error ', err);
                res.sendStatus(500);
            } else if (booksList) {
                response = Response.createResponse(Response.RequestStatus.Success, "camp list", booksList);
                res.status(200).json(response);
            } else {
                response = Response.createResponse(Response.RequestStatus.Success, "No camp found.", []);
                res.status(200).json(response);
            }
        });
})
router.get("/batch-master/list", isAuth,(req, res, next) => {
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
    BatchMaster.aggregate(
        pipe, function (err, booksList) {
            if (err) {
                console.log('error ', err);
                res.sendStatus(500);
            } else if (booksList) {
                response = Response.createResponse(Response.RequestStatus.Success, "camp list", booksList);
                res.status(200).json(response);
            } else {
                response = Response.createResponse(Response.RequestStatus.Success, "No camp found.", []);
                res.status(200).json(response);
            }
        });
})
router.get("/batch-master/batchById", isAuth, async(req, res, next) => {
    if(req.query.id){
    let batch = await BatchMaster.findById(req.query.id);
    let response = Response.createResponse(Response.RequestStatus.Success, "Batch Info", batch);
    res.status(200).json(response);
    } else{
        res.sendStatus(400); 
    }
})
router.get("/volunteer-master/list", isAuth, async(req, res, next) => {
    let isVolunteer = req.query.isVolunteer || false;
    let list = await VolunteerMasters.find({isVolunteer: isVolunteer});
    let response = Response.createResponse(Response.RequestStatus.Success, "Member Info", list);
    res.status(200).json(response);
})
router.get("/camp-master/list", isAuth,(req, res, next) => {
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
    CampMaster.aggregate(
        pipe, function (err, booksList) {
            if (err) {
                console.log('error ', err);
                res.sendStatus(500);
            } else if (booksList) {
                response = Response.createResponse(Response.RequestStatus.Success, "camp list", booksList);
                res.status(200).json(response);
            } else {
                response = Response.createResponse(Response.RequestStatus.Success, "No camp found.", []);
                res.status(200).json(response);
            }
        });
})
router.get("/camp-master/campById", isAuth, async(req, res, next) => {
    if(req.query.id){
    let batch = await CampMaster.findById(req.query.id);
    let response = Response.createResponse(Response.RequestStatus.Success, "Camp Info", batch);
    res.status(200).json(response);
    } else{
        res.sendStatus(400); 
    }
})
router.get("/camp-master/campIdList", isAuth,async(req, res, next) => {
    const listOfCamps = await CampMaster.find({},{"id":1,_id:0, "city": 1, "state": 1, "dist": 1, "year": 1});
response = Response.createResponse(Response.RequestStatus.Success, "camp list", listOfCamps);
res.status(200).json(response);
})
router.post("/camp-master/addMembersToCamp", isAuth,async(req, res, next) => {
    let campId =  req.body.campId
await CampMaster.findOneAndUpdate({id: campId},{memberIds: req.body.memberId});
response = Response.createResponse(Response.RequestStatus.Success, "Members Updated Sucessfully", {});
res.status(200).json(response);
})
router.post("/camp-master/addVolunttersToCamp", isAuth,async(req, res, next) => {
    let campId =  req.body.campId
await CampMaster.findOneAndUpdate({id: campId},{vIds: req.body.memberId});
response = Response.createResponse(Response.RequestStatus.Success, "Volunteers Updated Sucessfully", {});
res.status(200).json(response);
})
router.get("/camp-master/getMemberIdsByCampId", isAuth,async(req, res, next) => {
    let campId =  req.query.campId
    let list = await CampMaster.find({id: campId},{"memberIds":1, "vIds":1});
response = Response.createResponse(Response.RequestStatus.Success, "Members List", list);
res.status(200).json(response);
})
router.get("/volunteer-master/volunteersByCampId", isAuth,async (req, res, next) => {
    let response;
    if(req.query.campId){
      //  let listOfBatch = await BatchMaster.find({campId: req.query.campId});
        let list = await CampMaster.find({id: req.query.campId},{"memberIds":1, "vIds":1});
        let selectedIds = req.query.isVolunteer == 'true' ? list[0].vIds : list[0].memberIds;
        const vList = await VolunteerMasters.find({vId: { $in: selectedIds}})
        response = Response.createResponse(Response.RequestStatus.Success, "volunteer list", vList);
        res.status(200).json(response);
    } else{
        res.sendStatus(400);
    }

})
router.get("/camp-master/volunteerById", isAuth, async(req, res, next) => {
    if(req.query.id){
    let batch = await VolunteerMasters.findById(req.query.id);
    let response = Response.createResponse(Response.RequestStatus.Success, "Camp Info", batch);
    res.status(200).json(response);
    } else{
        res.sendStatus(400); 
    }
})

/**
 * users
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/participants-type/save", isAuth, (req, res, next) => {
    let description = req.body.description;
    if (description) {
        CampPCate.countDocuments({ description: description }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Description already available with this name.');
                res.json(200, response);
            } else {

                let book = new CampPCate(req.body);
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
 * campType
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/camp-type/save", isAuth, (req, res, next) => {
    let description = req.body.description;
    if (description) {
        CampType.countDocuments({ description: description }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Description already available with this name.');
                res.json(400, response);
            } else {

                let book = new CampType(req.body);
                book.save(function (err, results) {
                    if (err) {
                        let response = Response.createResponse(0, err.message);
                        res.status(500).json(response);
                    } else {
                        let message = "Camp Type Saved.";
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
router.post("/camp-type/edit", isAuth, (req, res, next) => {
    let description = req.body.description;
    if (description) {
        CampType.countDocuments({ description: description }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Description already available with this name.');
                res.json(400, response);
            } else {
                const id = req.body._id;
                CampType.findByIdAndUpdate(id,{description: description}, (err, result) => {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        let response = Response.createResponse(Response.RequestStatus.Success, "Camp Type Updated.", result);
                        res.status(200).json(response);
                    }
                });

            }
        });


    } else {
        res.sendStatus(400);
    }
})

router.post("/batch-master/save", isAuth, (req, res, next) => {
    if(req.body._id){
        const id = req.body._id;
        BatchMaster.findByIdAndUpdate(id,req.body, (err, result) => {
            if (err) {
                res.sendStatus(500);
            } else {
                let response = Response.createResponse(Response.RequestStatus.Success, "Batch Information Updated.", result);
                res.status(200).json(response);
            }
        });
    }
  else{
        BatchMaster.countDocuments({batchId: req.body.batchId}, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Batch Id already registered.');
                res.json(400, response);
            } else {
                let count = req.body.count;
                if (count) {
                    let batchMaster = new BatchMaster(req.body);
                    batchMaster.save(function (err, results) {
                        if (err) {
                            let response = Response.createResponse(0, err.message);
                            res.status(500).json(response);
                        } else {
                            let message = "Batch Information  Saved.";
                            let response = Response.createResponse(Response.RequestStatus.Success, message);
                            res.status(200).json(response);
                        }
                    });
    
    
                } else {
                    res.sendStatus(400);
                }
            }
        })
    }

})
router.post("/volunteer-master/save", isAuth, async (req, res, next) => {
    if(req.body._id){
        let id = req.body._id;
        VolunteerMasters.findByIdAndUpdate(id,req.body, (err, result) => {
                if (err) {
                    res.sendStatus(500);
                } else {
                    let response = Response.createResponse(Response.RequestStatus.Success, "Volunteer Information Updated.", result);
                    res.status(200).json(response);
                }
            });   
    } else{
    const count = await VolunteerMasters.countDocuments({vId: req.body.vId});
    if (count == 0) {
        let volunteerMasters = new VolunteerMasters(req.body);
        volunteerMasters.save(function (err, results) {
            if (err) {
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else {
                let message = "Volunteer  Information  Saved.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        let response = Response.createResponse(0, "Please Enter Unique Enrollment Number");
        res.status(500).json(response);
    }
}
})
router.post("/camp-master/save", isAuth, async (req, res, next) => {
    if(req.body._id){
        let id = req.body._id;
        CampMaster.findByIdAndUpdate(id,req.body, (err, result) => {
                if (err) {
                    res.sendStatus(500);
                } else {
                    let response = Response.createResponse(Response.RequestStatus.Success, "Camp Information Updated.", result);
                    res.status(200).json(response);
                }
            });   
    } else{
        const count = await CampMaster.countDocuments({id : req.body.id});
        if(count > 0){
            let response = Response.createResponse(0, "Please enter unique camp Number. This camp number is already present");
            res.status(500).json(response);
        }
        else if (req.body.id ) {
            let c = new CampMaster(req.body);
            c.save(function (err, results) {
                if (err) {
                    let response = Response.createResponse(0, err.message);
                    res.status(500).json(response);
                } else {
                    let message = "Camp Information  Saved.";
                    let response = Response.createResponse(Response.RequestStatus.Success, message);
                    res.status(200).json(response);
                }
            });
    
    
        } else {
            res.sendStatus(400);
        }    
    }
})
router.get("/camp-master/validate-camp-number", isAuth, async (req, res, next) => {
    const count = await CampMaster.countDocuments({id : req.query.id});
//    req.body.id = count;
    if(count > 0){
        let response = Response.createResponse(0, "Please enter unique camp Number. This camp number is already present");
        res.status(500).json(response);
    }
 else {
        let message = "Camp Number Avilable";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
    }
})
router.get("/camp-master/validate-enrollment-number", isAuth, async (req, res, next) => {
    const count = await VolunteerMasters.countDocuments({vId : req.query.id});
//    req.body.id = count;
    if(count > 0){
        let response = Response.createResponse(0, "Please enter unique enrollment number.");
        res.status(500).json(response);
    }
 else {
        let message = "Enrollment Number Avilable";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
    }
})
/**
 * Book
 * @purpose: This Rest API  used to  remove Book
 * @method: POST
 */
router.get("/participants-type/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        CampPCate.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "CampPCate Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
router.post("/participants-type/edit", isAuth, (req, res, next) => {
    let description = req.body.description;
    if (description) {
        CampPCate.countDocuments({ description: description }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'Description already available with this name.');
                res.json(400, response);
            } else {
                const id = req.body._id;
                CampPCate.findByIdAndUpdate(id,{description: description}, (err, result) => {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        let response = Response.createResponse(Response.RequestStatus.Success, "CampPCate Type Updated.", result);
                        res.status(200).json(response);
                    }
                });

            }
        });


    } else {
        res.sendStatus(400);
    }
})

router.get("/camp-type/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        CampType.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "Camp Type Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
router.get("/batch-master/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        BatchMaster.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "Camp Type Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
router.get("/volunteer-master/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        VolunteerMasters.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
router.get("/camp-master/deleteById", isAuth,(req, res, next) => {
    let id = req.query.id;
    if (id) {
        CampMaster.findByIdAndDelete(id, function (err, result) {
            if (err) {
                res.sendStatus(500);
            }else {
                let message = "Removed.";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})

module.exports = router;