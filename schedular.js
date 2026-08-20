let Subscription = require('./entity/subcription').Subscription;
let Subscriber = require('./entity/subscribers').Subscriber;

let validateSubscription = function () {
 console.log("Subcription Checked");
 Subscription.find({active : true}, (err, suceess) => {
    if (err) {
        console.log('error ', err);
        res.sendStatus(500);
    } else if (suceess) {
        suceess.forEach(element => {
            const today = new Date().getTime();
            if(today > element.endDate){
                const reqData = { active : false}
                Subscription.findByIdAndUpdate(element._id, reqData, (err, results) => {
                    if (err) {
                        console.log("Not updated this subcription"+ element._id)
                    } else {
                        console.log("updated subcription to deactive"+ element._id)
                        Subscription.countDocuments({subscriberId :  element.subscriberId, active : true}, (err, c) => {
                            if (err) {
                              console.log("Not able to find active subcription"+ element.subscriberId)
                            } else{
                                if(c === 0){
                                    Subscriber.findByIdAndUpdate(element.subscriberId, {active : false},function (err, result) {
                                        if (err) {
                                        } else {
                                            console.log("user status update"+ element.subscriberId)
                                        }
                                    });
                                }
                            }
                        })
                    }
                });
            }
        });
    }
})
};
exports.validateSubscription = validateSubscription;
