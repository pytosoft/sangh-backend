const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const isAuth = require('../middleware/is-auth')
const accountSid = 'AC759a65e8324204835e364960d271129d';
const authToken = '7d7cd6aed93c6720e5acdebcb98ad330';
const client = require('twilio')(accountSid, authToken);

/**
 * users
 * @purpose: This Rest API  used to send sms
 * @method: POST
 */
router.post("/", isAuth, async(req, res, next) => {
    let phoneNumbers = req.body;
    console.log(phoneNumbers)
    const messageResults = [];

    for (const contact of phoneNumbers) {
        try {
            const message = await client.messages.create({
                body: 'Dear '+contact.name+' We are pleased to inform you that your order has been dispatched from Sangh Shakti Jaipur '+ new Date(),
                from: '+14088728631',
                to: '+919587709076'
            });
            messageResults.push({ to: contact.mobile, status: 'Sent', sid: message.sid });
           } catch (error) {
            messageResults.push({ to: contact.mobile, status: 'Failed', error: error.message });
            console.error(`Failed to send message to ${contact.mobile}: ${error.message}`);
        }
    }
 	let message = "Book Saved.";
        let response = Response.createResponse(Response.RequestStatus.Success, messageResults);
        res.status(200).json(response);
})
module.exports = router;