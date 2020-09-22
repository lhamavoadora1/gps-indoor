module.exports = {
    isEmpty,
    Success,
    Error
};

function isEmpty(str) {
    console.log('str => ' + str);
    console.log('typeof str == undefined => ' + (typeof str == 'undefined'));
    console.log('str == null => ' + (str == null));
    console.log('str.length => ' + str.length);
    return (typeof str == 'undefined' || str == null || str.length == 0);
}

class Success {
    constructor(message) {
        this.success = true;
        this.message = message;
    }
}

class Error {
    constructor(message) {
        this.success = false;
        this.message = message;
    }
}