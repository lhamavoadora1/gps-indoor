function isEmpty(str) {
    // console.log('str => ' + str);
    // console.log('typeof str == undefined => ' + (typeof str == 'undefined'));
    // console.log('str == null => ' + (str == null));
    // console.log('str.length => ' + str.length);
    return (typeof str == 'undefined' || str == null || str.length == 0);
}

function getBase64Auth(authorization) {
    return (authorization || '').split(' ')[1] || '';
}

function getBasicAuthData(authorization) {

    const b64auth = getBase64Auth(authorization);
    const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');

    return {username: user, password: pass};

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

module.exports = {
    isEmpty,
    getBase64Auth,
    getBasicAuthData,
    Success,
    Error
};
