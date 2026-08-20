const express = require('express');
const router = express.Router();
let User = require('../entity/user').User;
const Book = require('../entity/book').Book;
const Plan = require('../entity/plans').Plans;
const Response = require('../config/response');
const isAuth = require('../middleware/is-auth');
const Subscriber = require('../entity/subscribers').Subscriber;
/**
 * get user by Id
 */
router.get("/:id", isAuth, async (req, res, next) => {
    try {
        const id = req.params.id;
        if (id) {
            const user = await User.findById(id);
            let returnResult = {}
           if(user && user.isSuperAdmin){
            const subsCount = await Subscriber.countDocuments();
            const activeSubsCount = await Subscriber.countDocuments({active: true});
            const booksCount = await Book.countDocuments();
            const planCount = await Plan.countDocuments();
            const admins = await User.find();
            returnResult.subsCount = subsCount;
            returnResult.booksCount = booksCount;
            returnResult.planCount = planCount;
            returnResult.admins = admins;
            returnResult.activeSubsCount = activeSubsCount;
            let response = Response.createResponse(Response.RequestStatus.Success, "Success", returnResult);
            res.status(200).json(response);
           } else {
            const subsCount = await Subscriber.countDocuments({createdBy: user._id});
            const activeSubsCount = await Subscriber.countDocuments({createdBy: user._id, active: true});
            const booksCount = await Book.countDocuments();
            const planCount = await Plan.countDocuments();
            const admin = await User.findById(user._id);
            returnResult.subsCount = subsCount;
            returnResult.booksCount = booksCount;
            returnResult.planCount = planCount;
            returnResult.depositAmount = admin.pendingAmount;
            returnResult.activeSubsCount = activeSubsCount;
            let response = Response.createResponse(Response.RequestStatus.Success, "Success", returnResult);
            res.status(200).json(response);
           }
        } else {
            res.sendStatus(400);
        }
      } catch (e) {
        res.sendStatus(500);
      }
    
})


module.exports = router;