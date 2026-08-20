let isStringEmpty = function (str) {
    if (str === null || str === undefined)
        return true;
    if (str.length > 0)
        return false;
    if (str.length === 0)
        return true;
    return true;
};

let isNumber = function (o) {
    if (typeof o === 'number')
        return true;
    return !isNaN(o - 0) && o !== null && o.replace(/^\s\s*/, '') !== "" && o !== false;
};

/**
 *  get the file ext
 * @param filename
 * @param def
 * @returns {*}
 */
let getExtension = function (filename, def) {
    let a = filename.split(".");
    if (a.length === 1 || (a[0] === "" && a.length === 2)) {
        return def;
    }
    return a.pop();
};

/***
 * Checks if string is valid ObjectId
 * @return {boolean}
 */
let isObjectId = function (id) {
    let regX = new RegExp("^[0-9a-fA-F]{24}$");
    if (typeof id === 'string')
        return regX.test(id);
    else
        return false;
};


/***
 * Checks if list is valid ObjectId array
 */
let isValidObjectIdArray = function (list) {
    if (list instanceof Array) {
        for (let x = 0; x < list.length; x++) {
            if (!isObjectId(list[x]))
                return false;
        }
        return true;
    } else
        return false;
};

let getBooleanParam = function (value, defVal) {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        return value === "1" || value === "true";
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    return defVal;
};

let isValidArray = function (list) {
    return Array.isArray(list) && list.length;
}
let getFileNameByFileObject = function (file) {
    if (file.originalname) {//for new multer
        return file.originalname;
    } else if (file.name) {//for old multer
        return file.name;
    } else {
        console.log('we are not sure which field have the file name');
        return '';
    }
};
exports.getBooleanParam = getBooleanParam;
exports.isStringEmpty = isStringEmpty;
exports.isNumber = isNumber;
exports.isObjectId = isObjectId;
exports.isValidObjectIdArray = isValidObjectIdArray;
exports.isValidArray = isValidArray;
exports.getFileNameByFileObject = getFileNameByFileObject;
exports.getExtension = getExtension;