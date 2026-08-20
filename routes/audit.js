const express = require('express');
const router = express.Router();
const Audit = require('../entity/audit').Audit;
const Response = require('../config/response');
const isAuth = require('../middleware/is-auth');

const DEFAULT_LIMIT = 10;

function toEvent(doc) {
    const item = doc.toObject ? doc.toObject() : doc;
    const at = item.at || item.createDate;
    return {
        id: String(item._id),
        type: item.type,
        message: item.message,
        actor: item.actor || 'anonymous',
        at: at ? new Date(at).toISOString() : new Date().toISOString(),
        data: item.data
    };
}

/**
 * Create an audit event
 * @method POST /audit
 */
router.post('/', isAuth, (req, res) => {
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    const type = typeof req.body.type === 'string' ? req.body.type.trim() : 'http';
    if (!message) {
        res.sendStatus(400);
        return;
    }
    const item = new Audit({
        type,
        message,
        actor: typeof req.body.actor === 'string' && req.body.actor.trim() ? req.body.actor.trim() : 'anonymous',
        data: req.body.data && typeof req.body.data === 'object' ? req.body.data : {},
        at: req.body.at ? new Date(req.body.at) : new Date()
    });
    item.save(function (err, saved) {
        if (err) {
            res.status(500).json(Response.createResponse(0, err.message));
            return;
        }
        res.status(200).json(Response.createResponse(Response.RequestStatus.Success, 'Audit saved.', toEvent(saved)));
    });
});

/**
 * Paginated audit list (default 10 per page)
 * @method GET /audit/list?page=1&limit=10
 */
router.get('/list', isAuth, (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
    Audit.countDocuments({}, function (countErr, total) {
        if (countErr) {
            res.sendStatus(500);
            return;
        }
        Audit.find({})
            .sort({ createDate: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                const data = (rows || []).map(toEvent);
                res.status(200).json(Response.createResponse(
                    Response.RequestStatus.Success,
                    'Audit list',
                    data,
                    total,
                    limit
                ));
            });
    });
});

/**
 * Clear audit events
 * @method GET /audit/clear
 */
router.get('/clear', isAuth, (req, res) => {
    Audit.deleteMany({}, function (err) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.status(200).json(Response.createResponse(Response.RequestStatus.Success, 'Audit cleared.', []));
    });
});

module.exports = router;
