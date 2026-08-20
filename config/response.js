/**
 * Response object to sent to
 */
 exports.RequestStatus = {
    Success: 1,
    Fail: 0,
    NotRegistered: 2
};
exports.createResponse = function (requestStatus, errorMessage, data, dataCount, limit) {
    return {
        status: requestStatus,
        message: errorMessage,
        data: data,
        dataCount: dataCount,
        limit: limit
    };
};