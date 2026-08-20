const express = require('express');
const router = express.Router();
let AppUtil = require('../utill/common');
let User = require('../entity/user').User;
const Response = require('../config/response')
const jwt = require('jsonwebtoken');
SALT_WORK_FACTOR = 10;

let bcrypt = null;
try {
    bcrypt = require('bcryptjs');
} catch (err) {
    console.log(err);
}
const JWT_SECRET = 'kyssupersecretsecret';

function isAccountActive(user) {
    return user && (user.active === true || user.active === 'true');
}

function hashPassword(plain, callback) {
    if (!bcrypt) {
        callback(null, plain);
        return;
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            callback(err);
            return;
        }
        bcrypt.hash(plain, salt, callback);
    });
}

function callerFromToken(req, callback) {
    const header = req.get('Authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) {
        callback(new Error('unauthorized'));
        return;
    }
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        callback(new Error('unauthorized'));
        return;
    }
    User.findById(decoded.userId, function (err, user) {
        if (err || !user) {
            callback(new Error('unauthorized'));
            return;
        }
        callback(null, user);
    });
}
router.post('/login', (req,res,next) => {
    if (req.body) {
        let email = req.body.email;//maybe a email address
        let password = req.body.password;
        if (!AppUtil.isStringEmpty(email) && !AppUtil.isStringEmpty(password)) {
            let loadedUser;
            User.findOne({email: email}, function (err, user) {
                if (err) {
                    res.send(500);
                } else if (user) {
                    loadedUser = user;
                    if(isAccountActive(user)){
                        user.comparePassword(password, function (err, isMatch) {
                            if (err) {
                                res.send(500);
                            } else if (isMatch) {
                                const token = jwt.sign(
                                    {
                                      email: loadedUser.email,
                                      userId: loadedUser._id.toString()
                                    },
                                    JWT_SECRET,
                                    { expiresIn: '1h' }
                                  );
                                  res.status(200).json({ token: token, userId: loadedUser._id.toString() });
                            } else {
                                let message = "Wrong password!";
                                let response = Response.createResponse(Response.RequestStatus.Fail, message);
                                res.status(401).json(response);
                            }
                        });
                    } else{
                        let message = "Sorry Your account has been restricated. Please contact administrator";
                        let response = Response.createResponse(Response.RequestStatus.Fail, message);
                        res.status(401).json(response);
                    }
                   
                } else {
                    let message = "A user with this email could not be found.";
                    let response = Response.createResponse(Response.RequestStatus.Fail, message);
                    res.status(401).json(response);
                }
            });

        } else {
            res.send(400);
        }
    } else {
        res.send(400);
    }
})
router.post('/auth/reset-password', (req,res,next) => {
    if (!req.body) {
        res.send(400);
        return;
    }
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    if (AppUtil.isStringEmpty(email) || AppUtil.isStringEmpty(newPassword)) {
        res.send(400);
        return;
    }
    if (confirmPassword != null && confirmPassword !== newPassword) {
        const response = Response.createResponse(Response.RequestStatus.Fail, 'New password and confirm password must match.');
        res.status(400).json(response);
        return;
    }

    callerFromToken(req, function (authErr, caller) {
        if (authErr || !caller) {
            const response = Response.createResponse(Response.RequestStatus.Fail, 'Unauthorized');
            res.status(401).json(response);
            return;
        }
        if (!isAccountActive(caller)) {
            const response = Response.createResponse(Response.RequestStatus.Fail, 'Sorry Your account has been restricated. Please contact administrator');
            res.status(401).json(response);
            return;
        }

        User.findOne({ email: email }, function (err, user) {
            if (err) {
                res.send(500);
                return;
            }
            if (!user) {
                const response = Response.createResponse(Response.RequestStatus.Fail, 'A user with this email could not be found.');
                res.status(401).json(response);
                return;
            }

            const isOwnPassword = caller._id.toString() === user._id.toString();
            if (!isOwnPassword && !caller.isSuperAdmin) {
                const response = Response.createResponse(Response.RequestStatus.Fail, 'You are not allowed to change another user password.');
                res.status(403).json(response);
                return;
            }

            const saveNewPassword = function () {
                hashPassword(newPassword, function (hashErr, hash) {
                    if (hashErr) {
                        next(hashErr);
                        return;
                    }
                    User.findByIdAndUpdate(user._id, { password: hash }, function (updateErr) {
                        if (updateErr) {
                            res.send(500);
                            return;
                        }
                        const response = Response.createResponse(Response.RequestStatus.Success, 'Password change sucessfully.');
                        res.status(200).json(response);
                    });
                });
            };

            if (isOwnPassword) {
                if (AppUtil.isStringEmpty(password)) {
                    res.send(400);
                    return;
                }
                user.comparePassword(password, function (compareErr, isMatch) {
                    if (compareErr) {
                        res.send(500);
                        return;
                    }
                    if (!isMatch) {
                        const response = Response.createResponse(Response.RequestStatus.Fail, 'Wrong password!');
                        res.status(400).json(response);
                        return;
                    }
                    saveNewPassword();
                });
                return;
            }

            saveNewPassword();
        });
    });
})
module.exports = router;
