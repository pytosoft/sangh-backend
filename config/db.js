/**
 * Create a database connection a return the connection
 *
 * @imp : please handle database connection exception
 * it throws a Exception in err on connection fail
 *
 */
let mongoose = require('mongoose');

exports.connect = function (callback, errorCallback) {
    mongoose.Promise = global.Promise;
//todo --add mongo url
    mongoose.connect('mongodb+srv://bidawatsurendrasingh_db_user:iZMyCO6rJgjVpT2u@cluster0.vsftrdt.mongodb.net/kysprod?retryWrites=true&w=majority', {useNewUrlParser: true});
    let db = mongoose.connection;
    db.on('error', function (err) { // error on connection
        console.error.bind(console, 'connection error:');
        if (typeof (errorCallback) == 'function') {
            errorCallback(err)
        }
    });
    db.once('open', function () {//connection done
        console.info('-------------Mongoose is connected to db server-------------');
        callback();
    });

};
