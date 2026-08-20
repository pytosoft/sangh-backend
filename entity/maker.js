/**
 * User Model for database schema
 *
 * @exports user
 */
let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
SALT_WORK_FACTOR = 10;

let bcrypt = null;
try {
    bcrypt = require('bcryptjs');
} catch (err) {
    console.log(err);
}
let AppUtil = require('../utill/common');

let maker = new Schema({
    name: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String, index: true },
    image: { type: String },
    isSuperAdmin: { type: Boolean },
    permissions: { type: [Number] },
    createDate: { type: Number },
    updateDate: { type: Number },
    fatherName: { type: String },
    id: { type: Number },
    active: { type: Boolean },
    city: { type: String },
    state: { type: String },
    mobile: {type: String},
    dob: { type: Date },
    region: { type: String },
    designation: { type: String },
    pendingAmount: {type: Number},
    depositAmount: {type: Number},
    depositAmountRequest: 
    { type: Array, "default": [] },
    address: {type: String}
});


maker.pre('save', function (next) {
    this.updateDate = new Date().getTime();
    // capitalize
    if (!bcrypt) {
        next();
        return;
    }
    let maker = this;

    // capitalize
    if (maker.isModified('name')) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }

    // only hash the password if it has been modified (or is new) || is no password here
    if (!maker.isModified('password') || AppUtil.isStringEmpty(maker.password))
        return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);

        // hash the password using our new salt
        bcrypt.hash(maker.password, salt, function (err, hash) {
            if (err)
                return next(err);
                maker.password = hash;
            next();
        });
    });
});


maker.methods.comparePassword = function (candidatePassword, cb) {
    if (!bcrypt) {
        cb(null, this.password === candidatePassword);
    } else {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err)
                return cb(err);
            cb(null, isMatch);
        });
    }
};



exports.Maker = mongoose.model('Makers', maker);